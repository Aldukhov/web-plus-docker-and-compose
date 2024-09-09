import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req) {
    return this.usersService.findUser({ id: req.user.id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/find')
  async findMany(@Query('search') search: string) {
    return this.usersService.findMany(search);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findUser({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async remove(@Request() req) {
    return this.usersService.remove({ id: req.user.id });
  }

  @Get('/me/wishes')
  async getMyUserWishes(@Req() req: any) {
    const user = req.user;
    return await this.usersService.getUserWishes(user.username);
  }
  @Get('/:username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.getUserWishes(username);
  }
}
