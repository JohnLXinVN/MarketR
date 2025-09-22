// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { SignupDto } from './dto/signup.dto';
import { async } from './../../../frontend/src/app/api/countries/route';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
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

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }

  async verify2FA(username: string, password: string, pincode: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });

    return {
      user: user ?? null,
      check: user ? user.pincode === pincode : false,
    };
  }

  async issueToken(id: number, username: string) {
    const payload = { sub: id, username };
    // sub = subject = userId, theo chuẩn JWT

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    return user;
  }
}
