import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Expose, Transform } from 'class-transformer';

export type TrainsDocument = Trains & Document;

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
export class Trains extends MongoDefaultDocument {
  @Prop()
  customId: string;

  @Prop()
  class: string;

  @Prop()
  type: string;

  @Prop()
  firstClassCapacity: number;

  @Prop()
  businessClassCapacity: number;

  @Prop()
  economyClassCapacity: number;

  @Prop()
  capacity: number;

  @Prop()
  enabled: boolean;

  constructor(partial: Partial<Trains>) {
    super();
    Object.assign(this, partial);
  }
}

export const TrainsSchema = SchemaFactory.createForClass(Trains);
