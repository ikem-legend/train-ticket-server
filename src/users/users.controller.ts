import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Users } from './entities/users.entity';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard) // Globally set
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['__'],
  })
  @Get('profile')
  getProfile(@Request() req) {
    return new Users(req.user);
  }
}
