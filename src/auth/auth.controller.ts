import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { ForgotPasswordDto } from '../users/dto/forgot-password.dto';
import { ResetUserPasswordDto } from '../users/dto/reset-user-password.dto';
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
  async register(@Body() body): Promise<string> {
    return this.authService.register(body);
  }

  @Public()
  @Get('/confirm/:token')
  async confirm(@Param('token') token: string): Promise<string> {
    return this.authService.confirm(token);
  }

  @Public()
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<string> {
    return this.authService.forgotPassword(body);
  }

  @Public()
  @Post('/reset-password')
  async resetPassword(@Body() body: ResetUserPasswordDto): Promise<string> {
    return this.authService.resetPassword(body);
  }
}
