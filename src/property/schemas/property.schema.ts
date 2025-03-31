import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class PropertyAddress {
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  pinCode: string;
  @Prop({ required: true })
  location: [number, number];
}
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
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
  address: PropertyAddress;

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
