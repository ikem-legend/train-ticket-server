import { Module } from '@nestjs/common';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trains, TrainsSchema } from './entities/trains.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trains.name, schema: TrainsSchema }]),
  ],
  controllers: [TrainsController],
  providers: [TrainsService],
})
export class TrainsModule {}
