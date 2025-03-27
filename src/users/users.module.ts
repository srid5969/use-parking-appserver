import { Module } from '@nestjs/common';
import { LoginAuthService } from './services/login-auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [LoginAuthService],
  controllers: [AdminController],
})
export class UsersModule {}
