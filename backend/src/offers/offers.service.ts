import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';

import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    // Проверяем, есть ли владелец у подарка
    if (!wish.owner || wish.owner.id === user.id) {
      throw new BadRequestException('Это ваш подарок');
    }

    const sum = +(wish.raised + createOfferDto.amount).toFixed(2);

    if (sum > wish.price) {
      throw new BadRequestException('Слишком много');
    }

    const { name, description, image, price } = wish;

    // Обновляем данные по поднятой сумме для подарка
    const updatedWish = await this.wishesService.updateRised(
      createOfferDto.wishId,
      {
        name,
        description,
        image,
        price,
      },
      sum,
    );

    // Сохраняем предложение
    return await this.offersRepository.save({
      ...createOfferDto,
      user: user,
      item: updatedWish,
    });
  }

  async findAll() {
    return await this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }
}
