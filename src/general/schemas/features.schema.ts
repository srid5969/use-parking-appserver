import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Status } from '../../common/enums';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Feature extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: Status.ACTIVE })
  status?: Status;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  deletedBy?: Types.ObjectId;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
