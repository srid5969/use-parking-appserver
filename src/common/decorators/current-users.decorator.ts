import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserTypeEnum } from '../enums';

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
