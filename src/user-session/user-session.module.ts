import { Module } from '@nestjs/common';
import { UserSessionManagementService } from './service/user-session-management.service';

@Module({
  providers: [UserSessionManagementService],
})
export class UserSessionModule {}
