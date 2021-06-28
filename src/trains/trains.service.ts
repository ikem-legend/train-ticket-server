import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trains } from './entities/trains.entity';
import { CreateTrainDto } from './dto/create-train.dto';

@Injectable()
export class TrainsService {
  constructor(
    @InjectModel(Trains.name) private readonly trainModel: Model<Trains>,
  ) {}

  async findAll() {
    return this.trainModel.find().lean();
  }

  async create(createTrain: CreateTrainDto) {
    const newTrain = new this.trainModel(createTrain);
    return newTrain.save();
  }
}
