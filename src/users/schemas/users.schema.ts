import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AddressType, UserStatus, UserTypeEnum } from '../../common/enums';

export class Address {
  @Prop()
  _id?: Types.ObjectId;

  @Prop({ default: AddressType.PRIMARY })
  type?: AddressType;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  pincode: string;

  @Prop()
  location?: number[];
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobilephone: string;

  @Prop({ default: 91 })
  country_code: number;

  @Prop()
  password: string;

  @Prop()
  gender: 'male' | 'female' | 'other';

  @Prop()
  username: string;

  @Prop()
  photo: string;

  @Prop({ enum: UserTypeEnum })
  user_type: UserTypeEnum;

  @Prop({ default: UserStatus.PENDING, enum: UserStatus })
  status: UserStatus;

  @Prop()
  addresses: Address[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  passwordUpdatedAt: Date;

  @Prop()
  about: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
