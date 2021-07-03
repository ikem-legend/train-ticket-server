import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trains, TrainsDocument } from './entities/trains.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(
    @InjectModel(Trains.name)
    private readonly trainModel: Model<TrainsDocument>,
  ) {}

  async findAll() {
    return this.trainModel.find().lean();
  }

  async findOne(id: string) {
    return this.trainModel.findOne({ _id: id }).lean();
  }

  async findOneById(id: string) {
    const train = await this.trainModel.findOne({ _id: id }).exec();
    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return train;
  }

  async create(createTrain: CreateTrainDto) {
    const updatedTrain =
      createTrain.enabled !== undefined
        ? createTrain
        : Object.assign(createTrain, { enabled: true });
    const newTrain = new this.trainModel(updatedTrain);
    await newTrain.save();
    return 'New train successfully created';
  }

  async update(id: string, updateTrain: UpdateTrainDto) {
    const existingTrain = await this.trainModel.findOneAndUpdate(
      { _id: id },
      { $set: updateTrain },
      { new: true },
    );
    if (!existingTrain) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return 'Train updated successfully';
  }

  async delete(id: string) {
    const existingTrain = await this.findOneById(id);
    await existingTrain.remove();
    return 'Train removed successfully';
  }
}
