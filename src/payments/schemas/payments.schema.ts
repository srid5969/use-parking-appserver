import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Payment extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    enum: ['credit_card', 'debit_card', 'UPI', 'net_banking', 'wallet'],
    required: true,
  })
  payment_method:
    | 'credit_card'
    | 'debit_card'
    | 'UPI'
    | 'net_banking'
    | 'wallet';

  @Prop({ required: true })
  transaction_id: string;

  @Prop({
    type: String,
    enum: ['pending', 'successful', 'failed', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'successful' | 'failed' | 'refunded';
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
