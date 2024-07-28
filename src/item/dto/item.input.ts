import { IsString, IsJSON } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  tokenId: string;

  @IsString()
  collectionId: string;

  @IsString()
  image: string;

  @IsString()
  owner: string;

  @IsJSON()
  metadata: string;
}

export class UpdateItemDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  tokenId: string;

  @IsString()
  owner: string;

  @IsJSON()
  metadata: string;
}
