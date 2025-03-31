import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddNewFeatureDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 'Light' })
  @IsString()
  name: string;

  @IsOptional()
  @ApiProperty({ default: 'Light feature' })
  @IsString()
  description: string;
}

export class UpdateFeatureDTO {
  @IsNotEmpty()
  @ApiProperty({ default: 'Light' })
  @IsString()
  name: string;

  @IsOptional()
  @ApiProperty({ default: 'Light feature' })
  @IsString()
  description: string;
}
