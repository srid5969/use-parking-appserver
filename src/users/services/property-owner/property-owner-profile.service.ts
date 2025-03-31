import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users-common.service';

@Injectable()
export class PropertyOwnerProfileService {
  constructor(private readonly userService: UserService) {}
  async getProfileDataByUserId(userId: string) {
    const data=await this.userService.getUserById(userId);
    return data;
  }
}
