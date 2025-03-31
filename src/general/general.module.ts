import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/users.schema';
import { UserService } from '../users/services/users/users-common.service';
import { FeaturesManagementController } from './conntroller/features-management.controller';
import { Feature, FeatureSchema } from './schemas/features.schema';
import { Setting, SettingSchema } from './schemas/settings.schema';
import {
  VehicleType,
  VehicleTypeSchema,
} from './schemas/vehicles-types.schema';
import { FeatureManagementService } from './services/features.service';
import { VehicleTypeManagementService } from './services/vehicles-types.schema';
import { VehicleTypeManagementController } from './conntroller/vehicle-type-maangement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feature.name, schema: FeatureSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: VehicleType.name, schema: VehicleTypeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    VehicleTypeManagementService,
    FeatureManagementService,
    UserService,
  ],
  controllers: [FeaturesManagementController, VehicleTypeManagementController],
})
export class GeneralModule {}
