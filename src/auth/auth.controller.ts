import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Render,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token, id } = await this.authService.login(req.user);
    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('userId', id);
    // return this.authService.login(req);
    return access_token;
  }

  @Get('login')
  @Render('auth/login')
  async renderLogin() {
    return { layout: 'auth', title: 'Sign in' };
  }
}
