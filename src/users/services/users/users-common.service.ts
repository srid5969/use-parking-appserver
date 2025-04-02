import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { omit } from 'lodash';
import { AppErrorMessages } from '../../../common/consts';
import { QueryParams } from '../../../common/dtos/query-params.dto';
import { UserStatus, UserTypeEnum } from '../../../common/enums';
import { User } from '../../schemas/users.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async throwErrorIfEmailOrPhoneAlreadyExists({
    email,
    phone,
  }: {
    email?: string;
    phone?: {
      code: number;
      number: number;
    };
  }) {
    if (email) email = email.toLowerCase().trim();
    const findOptions: {
      email?: string;
      phone?: {
        code: number;
        number: number;
      };
    }[] = [];
    if (email) findOptions.push({ email });
    if (phone)
      findOptions.push({ phone: { code: phone.code, number: phone.number } });

    const check = await this.userModel.findOne({
      $or: findOptions,
    });
    if (check) {
      if (
        'phone' in check &&
        'email' in check &&
        phone !== undefined &&
        email !== undefined &&
        check.email === email &&
        check.phone.code === phone.code &&
        check.phone.number === phone.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.EMAIL_PHONE_ALREADY_EXISTS,
        );
      } else if (
        'phone' in check &&
        phone !== undefined &&
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
    if (user.email) {
      user.email = user.email.toLowerCase().trim();
    }
    if (user.password) {
      user.password = user.password.trim();
      user.password = await bcrypt.hash(user.password, 12);
    }
    await this.throwErrorIfEmailOrPhoneAlreadyExists({
      email: user?.email,
      phone: user.phone,
    });
    const newUser = await this.userModel.create(user);
    const result = newUser.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ('password' in result) delete (result as any).password;
    return result;
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
    const result = updatedUser.toJSON();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ('password' in result) delete (result as any).password;

    return result;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userModel.findByIdAndUpdate(userId, {
      status: UserStatus.DELETED,
    });
    if (!deletedUser) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -__v');
    if (!user) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    return sanitizeUserData(
      user.toObject({
        schemaFieldsOnly: true,
        getters: true,
      }),
    );
  }

  async getUsersListByUserType(userType: UserTypeEnum[], params: QueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const sort = params.sort || 'createdAt|DESC';
    const filters = params.filters || '';
    const textSearch = params.textSearch || '';
    const skip = page * limit - limit;
    const [sortField, sortOrder] = sort.split('|');
    const filterAry = filters.split(',');
    const queryObj = {
      user_type: { $in: userType },
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

  async returnIfEmailOrPhoneAlreadyExistsWithPendingStatus({
    email,
    phone,
  }: {
    email?: string;
    phone?: {
      code: number;
      number: number;
    };
  }) {
    if (email) email = email.toLowerCase().trim();
    const findOptions: {
      email?: string;
      'phone.code'?: number;
      'phone.number'?: number;
    }[] = [];
    if (email) findOptions.push({ email });
    if (phone)
      findOptions.push({
        'phone.code': phone.code,
        'phone.number': phone.number,
      });
    const check = await this.userModel.findOne({
      $or: findOptions,
    });
    if (check) {
      if (check?.status === UserStatus.PENDING) {
        return check;
      }
      if (
        'phone' in check &&
        'email' in check &&
        phone !== undefined &&
        email !== undefined &&
        check.email === email &&
        check.phone.code === phone.code &&
        check.phone.number === phone.number
      ) {
        throw new BadRequestException(
          AppErrorMessages.EMAIL_PHONE_ALREADY_EXISTS,
        );
      } else if (
        'phone' in check &&
        phone !== undefined &&
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

  async saveOrUpdateUserWithPendingStatus(user: Partial<User>) {
    const existingUser =
      await this.returnIfEmailOrPhoneAlreadyExistsWithPendingStatus({
        email: user.email,
        phone: user.phone,
      });
    let result: User;
    if (existingUser) {
      existingUser.status = UserStatus.PENDING;
      for (const key in user) {
        if (key !== 'status') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          existingUser[key] = user[key];
        }
      }
      await existingUser.save();
      result = existingUser.toJSON();
    } else {
      user.status = UserStatus.PENDING;
      const newUser = await this.userModel.create(user);
      result = newUser.toJSON();
    }

    return sanitizeUserData(result);
  }

  async findUserByPhone(phone: {
    code: number;
    number: number;
  }): Promise<User> {
    const data = await this.userModel.findOne({
      'phone.code': phone.code,
      'phone.number': phone.number,
    });
    if (!data) {
      throw new NotFoundException(AppErrorMessages.USER_NOT_FOUND);
    }
    return data.toJSON();
  }
}
export const sanitizeUserData = (user: User) => {
  return omit(user, [
    'password',
    'otp',
    'otp_expire_at',
    'createdAt',
    'updatedAt',
    '__v',
    'status',
    '_id',
    'user_type',
    'phone_verified',
    'id',
  ]);
};
