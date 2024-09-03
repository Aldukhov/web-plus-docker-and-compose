import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Wish } from './wishes/entities/wish.entity';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT, 10),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [User, Offer, Wishlist, Wish],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Offer, Wishlist, Wish]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
