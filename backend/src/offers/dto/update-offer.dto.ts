import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsBoolean, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
