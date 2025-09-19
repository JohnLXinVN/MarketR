import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string): Promise<User | null> {
    return this.userService.findOne(username);
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Post()
  create(@Body() body: Partial<User>): Promise<User> {
    return this.userService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserOrders')
  async getUserOrders(@Query('id') id: number = 1, @Req() req) {
    const userId = req.user.userId;
    return this.userService.findUserById(userId);
  }
}
