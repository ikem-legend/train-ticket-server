import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class Users extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  userId: string;

  @Prop()
  dateOfBirth: Date;

  constructor(partial: Partial<Users>) {
    super();
    Object.assign(this, partial);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
