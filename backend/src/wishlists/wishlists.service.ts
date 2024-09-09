import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishService: WishesService,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishArr = await this.wishService.find({
      where: { id: In(createWishlistDto.itemsId) },
    });
    const wishList = await this.wishlistRepository.create({
      ...createWishlistDto,
      description: createWishlistDto.description || 'No description provided',
      user: user,
      items: wishArr,
    });
    return await this.wishlistRepository.save(wishList);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ relations: { user: true } });
  }

  async findOne(id: number): Promise<Wishlist | undefined> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['user', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist #${id} not found`);
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist | undefined> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    if (wishlist.user.id !== userId) {
      throw new ForbiddenException(
        `You do not have permission to update this wishlist`,
      );
    }
    const wishes = await this.wishService.findArr(updateWishlistDto.itemsId);
    return await this.wishlistRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      items: wishes.concat(wishlist.items),
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
    });
  }

  async remove(id: number, userId: number): Promise<Wishlist | undefined> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    if (wishlist.user.id !== userId) {
      throw new ForbiddenException(
        `You do not have permission to delete this wishlist`,
      );
    }
    await this.wishlistRepository.delete(id);
    return wishlist;
  }
}
