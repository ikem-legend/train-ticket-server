import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // JwtGuard globally set but test this
  @Post('/login')
  async login(@Body() body) {
    return this.authService.login(body);
  }

  @Public()
  @Post('/register')
  async register(@Body() body) {
    return this.authService.register(body.user);
  }
}
