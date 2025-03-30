import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Ticket extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  })
  status: 'open' | 'in_progress' | 'resolved' | 'closed';

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @Prop()
  attachments: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assigned_to?: Types.ObjectId;

  @Prop()
  comments: {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    message: string;
    created_at: Date;
  }[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
