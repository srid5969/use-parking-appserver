import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AddressType, UserStatus, UserTypeEnum } from '../../common/enums';

class Phone {
  @Prop({ required: true })
  number: number;

  @Prop({ required: true, default: 91 })
  code: number;
}

@Schema()
class Address {
  @Prop({ type: Types.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AddressType),
    default: AddressType.PRIMARY,
  })
  type: AddressType;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  pinCode: string;

  @Prop({ type: [Number], required: false })
  location?: [number, number];
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, type: Phone })
  phone: Phone;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: ['male', 'female', 'others'], required: true })
  gender: 'male' | 'female' | 'others';

  @Prop()
  photo?: string;

  @Prop()
  about?: string;

  @Prop({ type: String, enum: Object.values(UserTypeEnum), required: true })
  user_type: UserTypeEnum;

  @Prop({ type: [{ type: Address }] })
  addresses: Address[];

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
