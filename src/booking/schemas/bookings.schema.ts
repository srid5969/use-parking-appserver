import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Booking extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  property_id: Types.ObjectId;

  @Prop({ required: true })
  start_time: Date;

  @Prop({ required: true })
  end_time: Date;

  @Prop({ required: true })
  total_amount: number;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';

  @Prop({ required: true })
  vehicle_details: {
    vehicle_number: string;
    vehicle_type: string;
  };

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  })
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
