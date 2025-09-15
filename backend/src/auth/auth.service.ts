// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, password, pincode } = signupDto;

    // Check username tồn tại chưa
    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      username,
      password: hashedPassword,
      pincode,
    });

    const savedUser = await this.userRepo.save(newUser);

    // Ẩn password khi trả về
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async checkUsername(username: string) {
    const existingUser = await this.userRepo.findOne({ where: { username } });
    return { available: !existingUser };
  }
}
