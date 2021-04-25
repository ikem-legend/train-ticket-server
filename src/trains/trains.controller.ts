import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['__'],
  })
  @Get()
  async findAll() {
    return this.trainsService.findAll();
  }
}
