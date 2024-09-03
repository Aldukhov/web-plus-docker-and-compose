import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar', length: 1500 })
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
