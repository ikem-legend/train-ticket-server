import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTrainDto } from './dto/create-train.dto';
import { Trains } from './entities/trains.entity';

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
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    excludePrefixes: ['__'],
  })
  @Get(':id')
  // TODO: Fix wrong user ID case for this
  async findOne(@Param('id') id: string) {
    return new Trains(await this.trainsService.findOne(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() body: CreateTrainDto) {
    return this.trainsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: CreateTrainDto) {
    return this.trainsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.trainsService.delete(id);
  }
}
