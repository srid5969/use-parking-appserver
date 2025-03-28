import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';
import { User, UserSchema } from './schemas/users.schema';
import { AdminLoginService } from './services/admin/admin-login.service';
import { LoginAuthService } from './services/login-auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [LoginAuthService, AdminLoginService],
  controllers: [AdminController],
})
export class UsersModule {}
