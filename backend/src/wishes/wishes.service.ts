import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: owner,
    });

    return await this.wishRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find({ relations: ['owner', 'offers'] });
  }

  async find(options: any) {
    return this.wishRepository.find(options);
  }

  async findOne(id: number): Promise<Wish | undefined> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Wish #${id} not found`);
    }
    return wish;
  }
  async updateRised(
    id: number,
    updateData: UpdateWishDto,
    raised: number,
  ): Promise<Wish> {
    await this.wishRepository.update(id, { ...updateData, raised });
    return this.findOne(id);
  }

  async findFirst(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async findArr(idArr: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(idArr) },
      relations: ['owner', 'offers'],
    });
  }

  async update(
    userId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish | undefined> {
    const wish = await this.findOne(id);
    if (!wish || wish.owner.id !== userId) {
      throw new ForbiddenException('You can only edit your own wishes');
    }
    if (wish.raised > 0) {
      throw new ForbiddenException(
        'Cannot update the wish as it already has contributions.',
      );
    }
    await this.wishRepository.update(id, updateWishDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You can only delete your own wishes');
    }
    await this.wishRepository.delete(id);
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({ where: { id } });
    if (!wish) {
      throw new NotFoundException();
    }
    delete wish.id;
    await this.wishRepository.update(id, {
      copied: (wish.copied += 1),
    });
    const copyWish = {
      ...wish,
      raised: 0,
      copied: 0,
      offers: [],
      owner: user,
    };
    await this.create(copyWish, user);
    return copyWish;
  }
}
