import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { UserStatus, UserTypeEnum } from '../../common/enums';
import { AppMessages } from '../../common/consts';

@Injectable()
export class LoginAuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  public async loginUsingEmailPassword(
    email: string,
    password: string,
    userType: UserTypeEnum[],
  ) {
    email = email.toLocaleLowerCase();
    const user = await this.userModel.findOne({
      email,
      user_type: { $in: userType },
    });
    if (!user) throw new NotFoundException(AppMessages.USER_NOT_FOUND);
    if (user.status !== UserStatus.ACTIVE)
      throw new BadRequestException(AppMessages.USER_IS_NOT_ACTIVE);
    //TODO : compare password and throw error if wrong password
    // TODO : Return Profile Details , and access tokens and refresh token
  }
}
