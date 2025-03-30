import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Feature extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
