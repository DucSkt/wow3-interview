import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CollectionType, Prisma } from '@prisma/client';
import axios from 'axios';
import { ContractAddresses } from '~/common/address';
import { CollectionService } from '~/collection/collection.service';
import { Web3Service } from '~/web3/web3.service';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private collectionService: CollectionService,
    private web3Service: Web3Service,
  ) {}

  async create(data: Prisma.ItemCreateInput) {
    try {
      return await this.prisma.item.create({ data });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async createMany(data: Prisma.ItemCreateManyInput[]) {
    try {
      return await this.prisma.item.createMany({ data });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(id: string, data: Prisma.ItemUpdateInput) {
    try {
      return await this.prisma.item.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    try {
      return await this.prisma.item.findMany();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.prisma.item.findUnique({
        where: { id },
      });
      if (!item) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOneByTokenId(tokenId: string) {
    try {
      return await this.prisma.item.findMany({
        where: { tokenId },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findByCollectionId(collectionId: string) {
    try {
      return await this.prisma.item.findMany({
        where: { collectionId },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findByOwner(owner: string) {
    try {
      return await this.prisma.item.findMany({
        where: { owner },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async fetchTokenOwners(tokenIds: string[]): Promise<Record<string, string>> {
    const config = {
      method: 'post',
      url: 'https://skynet-api.roninchain.com/ronin/tokens/transfers/search',
      headers: {
        accept: 'application/json, text/plain, */*',
        origin: 'https://app.roninchain.com',
        'Content-Type': 'text/plain',
      },
      data: {
        contractAddresses: [ContractAddresses],
        tokenIds,
      },
    };

    const response = await axios(config);
    const items = response.data.result.items;
    const tokenIdToOwnerMap: Record<string, string> = {};

    items.forEach((item) => {
      tokenIdToOwnerMap[item.tokenId] = item.to;
    });

    return tokenIdToOwnerMap;
  }

  async fetchNftCollections(): Promise<boolean> {
    const config = {
      method: 'post',
      url: 'https://skynet-api.roninchain.com/ronin/nfts/search',
      headers: {
        accept: 'application/json, text/plain, */*',
        origin: 'https://app.roninchain.com',
        'Content-Type': 'text/plain',
      },
      data: {
        contractAddresses: [ContractAddresses],
        paging: { offset: 0, limit: 10 },
      },
    };

    const response = await axios(config);
    const nftItems = response.data.result.items;
    const tokenIds = nftItems.map((item) => item.tokenId);
    const tokenOwnerMap = await this.fetchTokenOwners(tokenIds);

    nftItems.forEach((nft) => {
      nft.owner = tokenOwnerMap[nft.tokenId] || '';
    });

    const collection = await this.collectionService.findOneByType(
      CollectionType.Axie,
    );
    const nfts = nftItems.map((item) => {
      const {
        owner,
        tokenId,
        rawMetadata: { name, image, properties },
      } = item;
      return {
        name,
        tokenId,
        collectionId: collection.id,
        image,
        owner,
        metadata: properties,
      };
    });
    await this.createMany(nfts);
    return true;
  }

  async fetchNftCollectionsV2(): Promise<boolean> {
    const [collection, axies] = await Promise.all([
      this.collectionService.findOneByType(CollectionType.Axie),
      this.web3Service.fetchAxieFromContract(),
    ]);

    axies.forEach((axie: any) => {
      axie.collectionId = collection.id;
    });
    await this.createMany(axies as Prisma.ItemCreateManyInput[]);
    return true;
  }
}
