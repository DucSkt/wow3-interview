import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaService } from '../prisma.service';
import { CollectionModule } from '~/collection/collection.module';
import { Web3Module } from '~/web3/web3.module';

@Module({
  imports: [CollectionModule, Web3Module],
  providers: [ItemService, PrismaService],
  controllers: [ItemController],
})
export class ItemModule {}
