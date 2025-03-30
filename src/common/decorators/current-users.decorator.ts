import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserTypeEnum } from '../enums';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { userMeta: CurrentUser }>();
    return request.userMeta;
  },
);

export class CurrentUser {
  userId: Types.ObjectId | string;
  user_type: UserTypeEnum;
  mobilePhone: number;
  phone_code: number;
}
