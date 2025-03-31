import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserTypeEnum } from '../enums';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { userMeta: CurrentUser }>();
    console.log('request.userMeta', request.userMeta);

    return request.userMeta;
  },
);

export class CurrentUser {
  userId: string;
  user_type: UserTypeEnum;
  mobilePhone: number;
  phone_code: number;
}
