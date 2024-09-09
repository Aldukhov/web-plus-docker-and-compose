import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: any, user: any) => void) {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: (err: any, user: any) => void) {
    const user = await this.usersService.findUser({ id });
    done(null, user);
  }
}
