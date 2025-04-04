import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { Model, Types } from 'mongoose';
import { AppErrorMessages } from '../../../common/consts';
import { User } from '../../schemas/users.schema';
import { sanitizeUserData } from './users-common.service';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
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

    if (!validate?.phone && !validate?.email) return;
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

  // validate can update phone or email - if verified dont update throw error if the provided phone or email is already in the db

  private async checkPhoneOeEmailCanUpdate(
    profileId: string,
    data: {
      email?: string;
      phone?: {
        code: number;
        number: number;
      };
    },
  ) {
    if (!data?.email && !data?.phone) return;
    const check = await this.userModel.findById(profileId);
    if (!check) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    if (
      check.email_verified &&
      data.email &&
      check.email !== data.email.toLowerCase().trim()
    ) {
      throw new BadRequestException(AppErrorMessages.EMAIL_ALREADY_VERIFIED);
    }
    if (
      check.phone_verified &&
      data.phone &&
      data.phone.code &&
      check.phone.code !== data.phone.code &&
      check.phone.number !== data.phone.number
    ) {
      throw new BadRequestException(AppErrorMessages.PHONE_ALREADY_VERIFIED);
    }
    return check;
  }

  async updateProfileByOwner(profileId: string, profile: Partial<User>) {
    profile = omit(profile, [
      'phone_verified',
      'email_verified',
      'otp',
      'otp_expire_at',
      'createdAt',
      'updatedAt',
      'user_type',
      'status',
      'updatedBy',
      'createdBy',
    ] as (keyof User)[]);

    await this.checkUsersEmailAnPhoneUniqueOnUpdate(
      new Types.ObjectId(profileId),
      {
        email: profile?.email,
        phone: profile?.phone,
      },
    );
    await this.checkPhoneOeEmailCanUpdate(profileId, {
      email: profile?.email,
      phone: profile?.phone,
    });

    if ('password' in profile && profile.password) {
      profile.password = profile.password.trim();
      profile.password = await bcrypt.hash(profile.password, 12);
    }

    const update = await this.userModel.findByIdAndUpdate(
      profileId,
      {
        $set: {
          ...profile,
        },
      },
      { new: true, runValidators: true },
    );

    if (!update) {
      throw new BadRequestException(AppErrorMessages.USER_NOT_FOUND);
    }
    return sanitizeUserData(
      update.toObject({ getters: true, schemaFieldsOnly: true }),
    );
  }
}
