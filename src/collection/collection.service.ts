import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CollectionType, Prisma } from '@prisma/client';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CollectionCreateInput) {
    try {
      return await this.prisma.collection.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(id: string, data: Prisma.CollectionUpdateInput) {
    try {
      return await this.prisma.collection.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    try {
      return await this.prisma.collection.findMany();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOne(id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id },
      });
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      return collection;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOneByType(type: CollectionType) {
    try {
      const collection = await this.prisma.collection.findFirst({
        where: { type },
      });
      if (!collection) {
        throw new NotFoundException(`Collection with type ${type} not found`);
      }
      return collection;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }
}
