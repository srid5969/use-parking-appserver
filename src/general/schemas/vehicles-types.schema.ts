import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class VehicleType extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  max_capacity: number;
}

export const VehicleTypeSchema = SchemaFactory.createForClass(VehicleType);
