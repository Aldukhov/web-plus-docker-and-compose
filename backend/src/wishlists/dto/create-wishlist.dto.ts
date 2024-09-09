import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: number[];
}
