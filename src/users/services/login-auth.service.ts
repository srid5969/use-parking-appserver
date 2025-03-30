import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AppErrorMessages, AppMessages } from '../../common/consts';
import { UserStatus, UserTypeEnum } from '../../common/enums';
import { User } from '../schemas/users.schema';
import { UserSessionManagementService } from '../../user-session/services/user-session-management.service';

@Injectable()
export class LoginAuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userSessionService: UserSessionManagementService,
  ) {}
  public async loginUsingEmailPassword(
    email: string,
    enteredPassword: string,
    userType: UserTypeEnum[],
  ) {
    email = email.toLowerCase();
    const user = await this.userModel.findOne({
      email,
      user_type: { $in: userType },
    });
    if (!user) throw new NotFoundException(AppMessages.USER_NOT_FOUND);
    if (user.status !== UserStatus.ACTIVE)
      throw new BadRequestException(AppMessages.USER_IS_NOT_ACTIVE);

    const isPasswordMatched = await bcrypt.compare(
      enteredPassword,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException(AppErrorMessages.INCORRECT_PASSWORD);
    }

    const token = await this.userSessionService.generateNewTokenUsingUserData({
      phone_code: user.phone.code,
      mobilePhone: user.phone.number,
      user_type: user.user_type,
      userId: user._id,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userProfileInfo = this.sanitization(user.toObject());

    return {
      ...token,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      profile_info: userProfileInfo,
    };
  }

  sanitization(user: User): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfileInfo } = user;
    return userProfileInfo;
  }
}
