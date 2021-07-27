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
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // JwtGuard globally set but test this
  @Post('/login')
  async login(@Request() req, @Res() response: Response) {
    const res = await this.authService.login(req.user, response);
    return response
      .status(HttpStatus.OK)
      .send({ message: 'Success login', data: res });
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
}
