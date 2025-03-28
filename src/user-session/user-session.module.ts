import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/users.schema';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { UserSessionManagementService } from './services/user-session-management.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  providers: [UserSessionManagementService],
})
export class UserSessionModule {}
