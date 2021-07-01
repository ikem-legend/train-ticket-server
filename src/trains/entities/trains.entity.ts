import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Trains extends Document {
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
}

export const TrainsSchema = SchemaFactory.createForClass(Trains);
