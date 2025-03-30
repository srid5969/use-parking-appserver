import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feature, FeatureSchema } from './schemas/features.schema';
import { Setting, SettingSchema } from './schemas/settings.schema';
import {
  VehicleType,
  VehicleTypeSchema,
} from './schemas/vehicles-types.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feature.name, schema: FeatureSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: VehicleType.name, schema: VehicleTypeSchema },
    ]),
  ],
})
export class GeneralModule {}
