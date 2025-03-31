import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSessionModule } from '../user-session/user-session.module';
import { AdminController } from './controllers/admin.controller';
import { User, UserSchema } from './schemas/users.schema';
import { AdminLoginService } from './services/admin/admin-login.service';
import { AdminManagementService } from './services/admin/admin-managements.service';
import { AdminProfileService } from './services/admin/admin-profile.service';
import { LoginAuthService } from './services/login-auth.service';
import { UserService } from './services/users/users-common.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserSessionModule,
  ],
  providers: [
    LoginAuthService,
    AdminLoginService,
    AdminProfileService,
    AdminManagementService,
    UserService,
  ],
  controllers: [AdminController],
})
export class UsersModule {}
