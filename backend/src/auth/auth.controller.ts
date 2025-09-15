import {
  Controller,
  Session,
  Post,
  Body,
  BadRequestException,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import * as svgCaptcha from 'svg-captcha';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // API tạo captcha
  @Get('captcha')
  async getCaptcha(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const captcha = svgCaptcha.create({
      size: 5,
      noise: 3,
      color: true,
      background: '#ccf2ff',
    });

    // lưu text vào session
    session.captchaText = captcha.text;
    console.log('Generated captcha:', captcha.text);
    res.type('svg');
    return res.send(captcha.data);
  }

  // API verify captcha
  @Post('verify-captcha')
  verifyCaptcha(
    @Body('captcha') captcha: string,
    @Session() session: Record<string, any>,
  ) {
    if (!session.captchaText) {
      throw new BadRequestException('Captcha expired');
    }
    if (captcha !== session.captchaText) {
      throw new BadRequestException('Captcha is wrong');
    }
    return { success: true };
  }

  // API signup
  @Post('check-username')
  async checkUsername(@Body('username') username: string) {
    if (!username) throw new BadRequestException("Username can't be empty");
    return this.authService.checkUsername(username);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  // API login (bonus)
}
