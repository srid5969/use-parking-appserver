import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSessionModule } from '../user-session/user-session.module';
import { AdminController } from './controllers/admin.controller';
import { CustomersController } from './controllers/customers.controller';
import { PropertyOwnerController } from './controllers/property_owner.controller';
import { User, UserSchema } from './schemas/users.schema';
import { AdminLoginService } from './services/admin/admin-login.service';
import { AdminManagementService } from './services/admin/admin-managements.service';
import { AdminProfileService } from './services/admin/admin-profile.service';
import { CustomerLoginService } from './services/customer/customer-login.service';
import { CustomerRegistrationService } from './services/customer/customer-registration.service';
import { LoginAuthService } from './services/login-auth.service';
import { PropertyOwnerLoginService } from './services/property-owner/property-owner-login.service';
import { PropertyOwnerRegistrationService } from './services/property-owner/property-owner-registration.service';
import { UserService } from './services/users/users-common.service';
import { PropertyOwnerProfileService } from './services/property-owner/property-owner-profile.service';
import { CustomerProfileService } from './services/customer/customer-profile.service';

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
    PropertyOwnerLoginService,
    CustomerLoginService,
    CustomerRegistrationService,
    PropertyOwnerRegistrationService,
    PropertyOwnerProfileService,
    CustomerProfileService,
  ],
  controllers: [AdminController, PropertyOwnerController, CustomersController],
})
export class UsersModule {}
