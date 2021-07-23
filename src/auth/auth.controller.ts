import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // JwtGuard globally set but test this
  @Post('/login')
  async login(@Request() req, @Res() response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('/register')
  async register(@Body() body) {
    return this.authService.register(body);
  }
}
