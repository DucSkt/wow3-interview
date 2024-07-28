import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from '~/item/dto/item.input';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    const collectionId = createItemDto.collectionId;
    delete createItemDto.collectionId;
    return this.itemService.create({
      ...createItemDto,
      collection: {
        connect: { id: collectionId },
      },
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Get('tokenId/:tokenId')
  findOneByTokenId(@Param('tokenId') tokenId: string) {
    return this.itemService.findOneByTokenId(tokenId);
  }

  @Get('collection/:collectionId')
  findByCollectionId(@Param('collectionId') collectionId: string) {
    return this.itemService.findByCollectionId(collectionId);
  }

  @Get('owner/:owner')
  findByOwner(@Param('owner') owner: string) {
    return this.itemService.findByOwner(owner);
  }

  @Get('nft/ronin')
  fetchNftRonin() {
    return this.itemService.fetchNftCollections();
  }
}
