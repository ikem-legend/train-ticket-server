import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';

export type UsersDocument = Users & Document;

// Re-implement base Document to allow class-transformer to serialize/deserialize its properties
// This class is needed, otherwise "_id" and "__v" would be excluded from the output
// or improperly serialized
class MongoDefaultDocument {
  @Expose()
  // Ensure that ObjectId is serialized into a string
  @Transform((value: any) => {
    if ('value' in value) {
      return value.value instanceof Types.ObjectId
        ? value.value.toHexString()
        : value.value.toString();
    }
    return 'unknown value';
  })
  public _id: string;

  @Expose()
  public __v: number;
}

@Schema()
export class Users extends MongoDefaultDocument {
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
  userId: number;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  @Exclude()
  confirmationToken: string;

  // TODO: Ensure that required values are also set directly in Mongoose
  @Prop()
  status: string;

  constructor(partial: Partial<Users>) {
    super();
    Object.assign(this, partial);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
