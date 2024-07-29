import Web3 from 'web3';
import { ContractAddresses } from '~/common/address';
import { AxieAbi } from '~/common/abi';
import { RoninChainRPC } from '~/common/api';
import axios from 'axios';

export class Web3Service {
  axieContract;
  constructor() {
    const provider = new Web3.providers.HttpProvider(RoninChainRPC);
    const web3 = new Web3(provider);
    this.axieContract = new web3.eth.Contract(AxieAbi, ContractAddresses);
  }

  async fetchAxieDetail(tokenIds) {
    try {
      const dataPromises = tokenIds.map(async (tokenId) => {
        const owner = await this.axieContract.methods.ownerOf(tokenId).call();
        const tokenURI = await this.axieContract.methods
          .tokenURI(tokenId)
          .call();
        return { tokenId, owner, tokenURI };
      });
      const dataResults = await Promise.all(dataPromises);
      const metadataPromises = dataResults.map(async ({ tokenURI }) => {
        const response = await axios.get(tokenURI);
        return response.data;
      });
      const metadataResults = await Promise.all(metadataPromises);
      return dataResults.map((data, index) => {
        return {
          name: metadataResults[index].name,
          tokenId: data.tokenId.toString(),
          image: metadataResults[index].image,
          owner: data.owner,
          metadata: metadataResults[index].properties,
        };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchAxieFromContract() {
    let totalSupply: number = await this.axieContract.methods
      .totalSupply()
      .call();
    totalSupply = Number(totalSupply);
    const tokienIds = [];
    // TODO use totalSupply instead of 5 to get all
    // Get first 5 Axie
    for (let i = 0; i < 5; i++) {
      const tokenId = await this.axieContract.methods.tokenByIndex(i).call();
      tokienIds.push(Number(tokenId));
    }
    return this.fetchAxieDetail(tokienIds);
  }
}
