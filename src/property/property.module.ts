import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { OwnersParkingManagementController } from './controllers/property-owner.controller';
import { PropertyOwnerPropertyManagementService } from './services/property-owner.services';
import { CustomerParkingManagementService } from './services/customer.service';
import { CustomerParkingController } from './controllers/customer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
  controllers: [OwnersParkingManagementController, CustomerParkingController],
  providers: [
    PropertyOwnerPropertyManagementService,
    CustomerParkingManagementService,
  ],
})
export class PropertyModule {}
