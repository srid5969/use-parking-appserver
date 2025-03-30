import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { AppErrorMessages } from '../../common/consts';
import { Status, UserTypeEnum } from '../../common/enums';
import { User } from '../../users/schemas/users.schema';
import { UserSession } from '../schemas/user-session.schema';
import { EnvironmentConfigType } from '../../configs';

@Injectable()
export class UserSessionManagementService {
  constructor(
    @InjectModel(UserSession.name)
    private userSessionModel: mongoose.Model<UserSession>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private configService: ConfigService<EnvironmentConfigType>,
  ) {}

  async create(userSession: UserSession) {
    await this.userSessionModel.create(userSession);
  }

  async logOut(id: string): Promise<UserSession> {
    try {
      //Find user session by id
      const userSession = await this.userSessionModel.findOneAndUpdate(
        { user_id: id },
        { status: Status.INACTIVE },
      );
      if (!userSession) {
        throw new NotFoundException('User session not found');
      }
      return userSession;
    } catch (error) {
      // TODO - refactor this
      if (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<UserSession> {
    try {
      //Find user session by id
      const userSession = await this.userSessionModel.findById(id);
      if (!userSession) {
        throw new NotFoundException('User session not found');
      }
      return userSession;
    } catch (error) {
      // TODO - refactor this
      if (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateNewTokenUsingRefreshToken(refresh_token: string) {
    const token = await this.userSessionModel.findOneAndDelete(
      {
        refresh_token: refresh_token,
      },
      { returnDocument: 'before' },
    );
    if (!token) throw new NotFoundException(AppErrorMessages.TOKEN_INVALID);
    const user = await this.userModel
      .findById(token.toJSON().user_id)
      .select(['email', 'phone', 'user_type'])
      .lean();
    const expiresIn =
      this.configService.getOrThrow<string>('accessTokenSecret');
    if (!user) throw new NotFoundException();
    const tokenPayload = {
      userId: user._id,
      user_type: user.user_type,
      mobilephone: user.phone.number,
      country_code: user.phone.code,
      expiresIn,
    };
    const access_token = jwt.sign(
      tokenPayload,
      this.configService.getOrThrow<string>('accessTokenSecret'),
      { expiresIn },
    );
    refresh_token = jwt.sign(
      { ...tokenPayload, type: 'refresh_token' },
      this.configService.getOrThrow<string>('refreshTokenSecret'),
      {
        expiresIn: this.configService.getOrThrow<string>('refreshTokenExpiry'),
      },
    );
    await this.create({
      access_token,
      refresh_token,
      user_id: tokenPayload.userId,
    });

    return { access_token, refresh_token };
  }
  async generateNewTokenUsingUserData(user: {
    userId: mongoose.Types.ObjectId | string;
    user_type: UserTypeEnum;
    mobilePhone: number;
    phone_code: number;
  }) {
    const expiresIn =
      this.configService.getOrThrow<string>('accessTokenExpiry');
    const tokenPayload = {
      userId: user.userId,
      user_type: user.user_type,
      mobilePhone: user.mobilePhone,
      phone_code: user.phone_code,
      expiresIn,
    };
    const access_token = jwt.sign(
      tokenPayload,
      this.configService.getOrThrow<string>('accessTokenSecret'),
      { expiresIn },
    );
    const refresh_token = jwt.sign(
      { ...tokenPayload, type: 'refresh_token' },
      this.configService.getOrThrow<string>('refreshTokenSecret'),
      {
        expiresIn: this.configService.getOrThrow<string>('refreshTokenExpiry'),
      },
    );
    await this.create({
      access_token,
      refresh_token,
      user_id: tokenPayload.userId as mongoose.Types.ObjectId,
    });
    return { access_token, refresh_token };
  }
}
