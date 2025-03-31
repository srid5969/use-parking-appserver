import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../schemas/users.schema';
import { AppErrorMessages } from '../../../common/consts';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { QueryParams } from '../../../common/dtos/query-params.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async checkIfEmailOrPhoneAlreadyExists(
    email: string,
    phone: {
      code: number;
      number: number;
    },
  ) {
    email = email.toLowerCase().trim();
    const check = await this.userModel.findOne({
      $or: [{ email }, { phone: { code: phone.code, number: phone.number } }],
    });
    if (check) {
      if (
        check.email === email &&
        check.phone.code === phone.code &&
        check.phone.number === phone.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.EMAIL_PHONE_ALREADY_EXISTS,
        );
      } else if (
        check.phone.code === phone.code &&
        check.phone.number === phone.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.PHONE_NUMBER_ALREADY_EXISTS,
        );
      } else if (check.email === email) {
        throw new BadRequestException(AppErrorMessages.EMAIL_ALREADY_EXISTS);
      }
    }
    return false;
  }

  async createUser(user: User) {
    await this.checkIfEmailOrPhoneAlreadyExists(user.email, user.phone);
    const newUser = await this.userModel.create(user);
    user.password = await bcrypt.hash(user.password, 12);
    return newUser;
  }

  async updateUser(
    userId: string,
    user: Partial<User>,
    actionBy: Types.ObjectId,
  ) {
    await this.checkUsersEmailAnPhoneUniqueOnUpdate(
      new Types.ObjectId(userId),
      {
        email: user?.email,
        phone: user?.phone,
      },
    );
    user.updatedBy = actionBy;
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndUpdate(userId, {
      status: UserStatus.DELETED,
    });
    if (!deletedUser) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    return deletedUser;
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async getUsersListByUserType(userType: UserTypeEnum[], params: QueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'created_at|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {
      userType: { $in: userType },
      status: { $ne: UserStatus.DELETED },
    };
    for (const element of filterAry) {
      const filterVal = element;
      const [search_field, search_value] = filterVal.split('|');

      queryObj[search_field] = search_value;
    }

    if (textSearch) {
      queryObj['$or'] = [];
    }

    const data = await this.userModel
      .find(queryObj, {
        email: 1,
        name: 1,
        status: 1,
        phone: 1,
        userType: 1,
        createdAt: 1,
        updatedAt: 1,
        photo: 1,
      })
      .limit(limit)
      .skip(skip)
      .sort({ [sortField]: sortOrder === 'DESC' ? -1 : 1 });
    const totalCount = await this.userModel.countDocuments(queryObj);

    return { data, totalCount };
  }

  async validateIfUserIsSuperAdmin(userId: string) {
    const user = await this.userModel.findById(userId, {
      status: 1,
      user_type: 1,
      email: 1,
      phone: 1,
      name: 1,
      photo: 1,
    });
    if (!user) throw new NotFoundException();
    if (user.status !== UserStatus.ACTIVE)
      throw new BadRequestException(AppErrorMessages.USER_NOT_ACTIVE);
    if (user.user_type !== UserTypeEnum.SUPER_ADMIN)
      throw new BadRequestException(AppErrorMessages.USER_NOT_SUPER_ADMIN);
    return user;
  }

  async validateIfUserIsAdmin(userId: string) {
    const user = await this.userModel.findById(userId, {
      status: 1,
      user_type: 1,
      email: 1,
      phone: 1,
      name: 1,
      photo: 1,
    });
    if (!user) throw new NotFoundException();
    if (user.status !== UserStatus.ACTIVE)
      throw new BadRequestException(AppErrorMessages.USER_NOT_ACTIVE);
    if (
      user.user_type !== UserTypeEnum.SUPER_ADMIN &&
      user.user_type !== UserTypeEnum.ADMIN
    )
      throw new BadRequestException(AppErrorMessages.USER_NOT_ADMIN);
    return user;
  }
  private async checkUsersEmailAnPhoneUniqueOnUpdate(
    userId: Types.ObjectId,
    validate: {
      email?: string;
      phone?: {
        code: number;
        number: number;
      };
    },
  ) {
    const findOptions = {
      _id: { $nin: userId },
    };
    if ('email' in validate) {
      findOptions['email'] = validate.email?.toLowerCase().trim();
    }
    if ('phone' in validate) {
      findOptions['phone'] = validate.phone;
    }
    const check = await this.userModel.findOne(findOptions);
    if (check) {
      if (
        'phone' in validate &&
        'email' in validate &&
        check.email === validate.email &&
        check.phone.code === validate?.phone?.code &&
        check.phone.number === validate?.phone?.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.EMAIL_PHONE_ALREADY_EXISTS,
        );
      } else if (
        'phone' in validate &&
        check.phone.code === validate?.phone?.code &&
        check.phone.number === validate?.phone.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.PHONE_NUMBER_ALREADY_EXISTS,
        );
      } else if ('email' in validate && check.email === validate?.email) {
        throw new BadRequestException(AppErrorMessages.EMAIL_ALREADY_EXISTS);
      }
    }
    return false;
  }
}
