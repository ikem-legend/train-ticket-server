import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Trains } from './entities/trains.entity';
import { Model } from 'mongoose';
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
    const trainCustomId = uuidv4();
    const updatedCreateTrain = Object.assign(createTrain, {
      customId: trainCustomId,
    });
    const newTrain = new this.trainModel(updatedCreateTrain);
    return newTrain.save();
  }
}
