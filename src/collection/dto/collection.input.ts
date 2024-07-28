import { Prisma, CollectionType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto implements Prisma.CollectionCreateInput {
  @IsString()
  name: string;

  @IsEnum(() => CollectionType)
  type: CollectionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateCollectionDto implements Prisma.CollectionUpdateInput {
  @IsString()
  name: string;

  @IsEnum(() => CollectionType)
  type: CollectionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
