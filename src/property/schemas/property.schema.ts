import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Property extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner_id: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  address: {
    city: string;
    country: string;
    pinCode: string;
    location: [number, number];
  };

  @Prop({ required: true })
  price_per_hour: number;

  @Prop({
    type: String,
    enum: ['available', 'occupied', 'reserved', 'inactive'],
    default: 'available',
  })
  status: 'available' | 'occupied' | 'reserved' | 'inactive';

  @Prop()
  photos: string[];

  @Prop({ required: true })
  capacity: number;

  @Prop()
  vehicle_types_allowed: { _id: Types.ObjectId; name: string }[];

  @Prop()
  features: { _id: Types.ObjectId; name: string }[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);
