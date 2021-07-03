import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async findOne(email: string) {
    // Since additional methods won't be used on this query,
    // lean is used in place of exec
    return this.userModel.findOne({ email }).lean();
  }

  async findOneByUserId(userId: number) {
    return this.userModel.findOne({ userId }).exec();
  }

  async findOneByPhone(phone: string) {
    return this.userModel.findOne({ phone }).exec();
  }

  async findAll() {
    const allUsers: Users[] = await this.userModel.find().lean();
    if (!allUsers.length) {
      return allUsers;
    }
    const serializedUsers = allUsers.map((userData) => new Users(userData));
    return serializedUsers;
  }

  async create(createUser: CreateUserDto) {
    const newUser = new this.userModel(createUser);
    return newUser.save();
  }
}
