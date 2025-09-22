import {
  Controller,
  Session,
  Post,
  Body,
  BadRequestException,
  Get,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import * as svgCaptcha from 'svg-captcha';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
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

  @Post('login-check')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    // ✅ chỉ trả về flag cho phép sang 2FA
    return { success: true, userId: user.id };
  }

  // API login (bonus)

  @Post('login')
  async login2fa(
    @Body() body: { username: string; password: string; pincode: string },
  ) {
    const isValid = await this.authService.verify2FA(
      body.username,
      body.password,
      body.pincode,
    );
    if (!isValid.check) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const access_token = await this.authService.issueToken(
      isValid.user!.id,
      isValid.user!.username,
    );

    // ✅ chính thức cấp token
    return {
      token: access_token.access_token,
      user: isValid.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Req() req) {
    const userId = req.user.userId;
    const user = await this.authService.getUserById(userId);
    return user;
  }
}
