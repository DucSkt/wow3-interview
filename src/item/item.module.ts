import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaService } from '../prisma.service';
import { CollectionModule } from '~/collection/collection.module';
@Module({
  imports: [CollectionModule],
  providers: [ItemService, PrismaService],
  controllers: [ItemController],
})
export class ItemModule {}
