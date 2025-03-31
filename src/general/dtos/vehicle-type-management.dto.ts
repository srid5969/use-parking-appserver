import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../../common/enums';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewVehicleTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  description?: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  max_capacity: number;
}

export class UpdateVehicleTypeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  max_capacity?: number;
  @ApiPropertyOptional()
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
