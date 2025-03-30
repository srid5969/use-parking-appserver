import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AppErrorMessages } from '../consts';
import { EnvironmentConfigType } from '../../configs';

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvironmentConfigType>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: { headers: { authorization: string }; userMeta: unknown } =
      context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    //JWT token basic check
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(AppErrorMessages.TOKEN_MISSING);
    }

    // token is present
    // verify it and meta data attach it to the request in subsequence
    try {
      const secretForJWT =
        this.configService.getOrThrow<string>('accessTokenSecret');
      const decoded = jwt.verify(token, secretForJWT);
      // continue with authorization logic
      request.userMeta = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException(AppErrorMessages.TOKEN_INVALID);
    }
  }

  handleRequest(err: unknown, user: unknown) {
    if (err) {
      throw new UnauthorizedException();
    }

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
