// dto/create-booking.dto.ts

import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class VehicleDetailsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vehicle_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  vehicle_type: string;
}

export class CreateBookingDto {
  @IsMongoId()
  @ApiProperty()
  property_id: string;

  @IsDateString()
  @ApiProperty({ type: 'string', format: 'date-time' })
  start_time: string;

  @IsDateString()
  @ApiProperty({ type: 'string', format: 'date-time' })
  end_time: string;

  @ValidateNested()
  @Type(() => VehicleDetailsDto)
  @ApiProperty({ type: VehicleDetailsDto })
  vehicle_details: VehicleDetailsDto;
}
