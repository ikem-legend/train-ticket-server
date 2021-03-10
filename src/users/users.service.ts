import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async findOne(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneByUserId(userId: number) {
    return this.userModel.findOne({ userId });
  }

  async findOneByPhone(phone: string) {
    return this.userModel.findOne({ phone });
  }

  async create(createUser: CreateUserDto) {
    const newUser = new this.userModel(createUser);
    return newUser.save();
  }
}
