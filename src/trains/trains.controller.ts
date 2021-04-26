import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTrainDto } from './dto/create-train.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() body: CreateTrainDto) {
    return this.trainsService.create(body);
  }
}
