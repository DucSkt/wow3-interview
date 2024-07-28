import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from '~/collection/dto/collection.input';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }
}
