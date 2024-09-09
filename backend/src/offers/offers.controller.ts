import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() body: CreateOfferDto, @Req() { user }: { user: User }) {
    return await this.offersService.create(body, user);
  }
  @Get()
  findAll() {
    return this.offersService.findAll();
  }
}
