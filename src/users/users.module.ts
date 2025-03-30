import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';
import { User, UserSchema } from './schemas/users.schema';
import { AdminLoginService } from './services/admin/admin-login.service';
import { LoginAuthService } from './services/login-auth.service';
import { UserSessionModule } from '../user-session/user-session.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserSessionModule,
  ],
  providers: [LoginAuthService, AdminLoginService],
  controllers: [AdminController],
})
export class UsersModule {}
