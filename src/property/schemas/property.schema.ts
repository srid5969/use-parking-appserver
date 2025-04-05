import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VehicleType } from '../../general/schemas/vehicles-types.schema';
import { Feature } from '../../general/schemas/features.schema';

export class PropertyAddress {
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  pinCode: string;
  @Prop({ type: [Number], required: true, index: '2dsphere' })
  location: [number, number];
}
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Property  {
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

  @Prop({
    type: String,
    enum: ['available', 'not_available'],
    default: 'available',
  })
  status: 'available' | 'not_available';

  @Prop()
  photos: string[];

  @Prop({ required: true })
  capacity: number;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, ref: VehicleType.name }, // use actual collection name if exists
        name: String,
      },
    ],
  })
  vehicle_types_allowed: { _id: Types.ObjectId; name: string }[];

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, ref: Feature.name }, // use actual collection name if exists
        name: String,
      },
    ],
  })
  features: { _id: Types.ObjectId; name: string }[];
}

export const PropertySchema = SchemaFactory.createForClass(Property);
