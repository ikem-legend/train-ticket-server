import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trains } from './entities/trains.entity';
import { Model } from 'mongoose';

@Injectable()
export class TrainsService {
  constructor(
    @InjectModel(Trains.name) private readonly trainModel: Model<Trains>,
  ) {}

  async findAll() {
    return this.trainModel.find().lean();
  }
}
