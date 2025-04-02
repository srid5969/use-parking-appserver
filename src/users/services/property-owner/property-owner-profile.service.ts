import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users-common.service';
import { User } from '../../schemas/users.schema';
import { UserProfileService } from '../users/user-profile.service';

@Injectable()
export class PropertyOwnerProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: UserProfileService,
  ) {}
  async getProfileDataByUserId(userId: string) {
    const data = await this.userService.getUserById(userId);
    return data;
  }

  async updateProfileDataByUserId(userId: string, profile: Partial<User>) {
    const data = await this.profileService.updateProfileByOwner(
      userId,
      profile,
    );
    return data;
  }
}
