import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'UPI'
  | 'net_banking'
  | 'wallet'
  | 'emi'
  | 'bank_transfer'
  | 'cash';

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Payment extends Document<Types.ObjectId> {
  // References
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  // Core identifiers
  @Prop({ required: true })
  amount: number; // in rupees

  @Prop({ required: true, default: 'INR' })
  currency: string; // always standard 3-letter ISO code

  @Prop({ required: true, unique: true })
  order_id: string; // Razorpay order_id

  @Prop({ required: false, unique: true, sparse: true })
  payment_id?: string; // Razorpay payment_id (transaction ID)

  @Prop({ required: false })
  receipt?: string; // Internal receipt/tracking

  // Method and status
  @Prop({
    type: String,
    enum: [
      'credit_card',
      'debit_card',
      'UPI',
      'net_banking',
      'wallet',
      'emi',
      'bank_transfer',
      'cash',
    ],
    required: false,
  })
  payment_method?: PaymentMethod;

  @Prop({
    type: String,
    enum: ['pending', 'successful', 'failed', 'refunded'],
    default: 'pending',
  })
  status: PaymentStatus;

  // Timestamps and meta
  @Prop({ required: false })
  captured_at?: Date;

  @Prop({ required: false })
  refunded_at?: Date;

  @Prop({ required: false })
  refunded_amount?: number;

  @Prop({ required: false })
  failure_reason?: string;

  // Contact info from Razorpay (optional but good for traceability)
  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  contact?: string;

  // Any metadata from your app
  @Prop({ type: Object, required: false })
  notes?: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
