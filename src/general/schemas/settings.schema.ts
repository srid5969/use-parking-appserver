import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Setting extends Document<Types.ObjectId> {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  value: number;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updatedBy?: Types.ObjectId;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
