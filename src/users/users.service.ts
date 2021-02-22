import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async findOne(email: string) {
    return this.userModel.findOne({ email }).exec();
    // const user = await this.userModel.findOne({ email });
    // if (!user) {
    //   throw new UnauthorizedException('User does not exist');
    // }
    // return user;
  }
}
