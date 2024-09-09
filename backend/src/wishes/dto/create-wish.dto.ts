import { IsNotEmpty, IsString, IsUrl, Length, IsNumber } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  raised?: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
