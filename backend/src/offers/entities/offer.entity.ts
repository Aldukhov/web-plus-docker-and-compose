import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  hidden: boolean;

  @Column()
  amount: number;

  @OneToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;
}
