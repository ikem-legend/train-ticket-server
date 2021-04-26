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
  capacity: number;

  @Prop()
  firstClassCapacity: number;

  @Prop()
  economyClassCapacity: number;

  @Prop()
  enabled: boolean;
}

export const TrainsSchema = SchemaFactory.createForClass(Trains);
