import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Notification extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: ['booking', 'payment', 'system', 'promotional', 'support'],
    required: true,
  })
  type: 'booking' | 'payment' | 'system' | 'promotional' | 'support';

  @Prop({
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
  })
  status: 'unread' | 'read' | 'archived';

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
