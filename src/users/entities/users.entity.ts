import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';

export type UsersDocument = Users & Document;

export enum UserStatus {
  Active = 'Active',
  Pending = 'Pending',
  Inactive = 'Inactive',
}

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
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  @Exclude()
  password!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ required: true })
  @Exclude()
  confirmationToken: string;

  @Prop({ required: true, enum: Object.values(UserStatus) })
  status!: string;

  constructor(partial: Partial<Users>) {
    super();
    Object.assign(this, partial);
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
