import { AdminPropertiesManagementController } from './controllers/admin.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { OwnersParkingManagementController } from './controllers/property-owner.controller';
import { PropertyOwnerPropertyManagementService } from './services/property-owner.services';
import { CustomerParkingManagementService } from './services/customer.service';
import { CustomerParkingController } from './controllers/customer.controller';
import { AdminPropertyManagementService } from './services/admin.service';
import { UserService } from '../users/services/users/users-common.service';
import { User, UserSchema } from '../users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    OwnersParkingManagementController,
    CustomerParkingController,
    AdminPropertiesManagementController,
  ],
  providers: [
    PropertyOwnerPropertyManagementService,
    CustomerParkingManagementService,
    AdminPropertyManagementService,
    UserService,
  ],
})
export class PropertyModule {}
