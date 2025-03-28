import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Status } from '../../common/enums';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class UserSession {
  @Prop()
  access_token: string;

  @Prop()
  refresh_token?: string;

  @Prop()
  expiry_at: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: Status.ACTIVE })
  status?: Status;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
