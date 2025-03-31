import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../../common/enums';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Feature extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  status: Status;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
