import { Delete, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findOneByToken(confirmationToken: string) {
    return this.userModel.findOne({ confirmationToken }).lean();
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

  async edit(id: string, editUser: UpdateUserDto) {
    const existingUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: editUser },
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return 'User edited successfully';
  }

  @Delete(':id')
  async delete(id: string) {
    const existingUser = await this.findOneByUserId(parseInt(id, 10));
    if (!existingUser) {
      return 'User does not exist and therefore can not be deleted';
    }
    await existingUser.remove();
    return 'Successfully deleted user';
  }
}
