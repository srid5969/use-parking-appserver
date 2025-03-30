import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async getAdminProfile(userId: string) {
    return await this.userModel.findById(userId).select('-password -__v');
  }
}
