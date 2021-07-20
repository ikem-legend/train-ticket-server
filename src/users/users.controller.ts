import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard) // Globally set
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['__'],
  })
  @Get('profile')
  getProfile(@Request() req) {
    return new Users(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['__'],
  })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async edit(@Param('id') id: string, @Body() editUser: UpdateUserDto) {
    return this.usersService.edit(id, editUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
