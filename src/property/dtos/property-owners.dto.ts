import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PropertyAddressDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  street?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  pinCode?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    description: '[longitude,latitude]',
    example: [13.0827, 80.2707],
  })
  location?: [number, number]; // [latitude, longitude]
}

class NameReferenceDto {
  @IsMongoId()
  @ApiProperty()
  _id: string;

  @IsString()
  @ApiProperty()
  name: string;
}

export class CreatePropertyDto {
  @IsString()
  @ApiProperty()
  type: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @ValidateNested()
  @Type(() => PropertyAddressDto)
  @ApiProperty({ type: () => PropertyAddressDto })
  address: PropertyAddressDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @ApiProperty({ type: [String], maxItems: 5 })
  photos?: string[];

  @IsNumber()
  @ApiProperty()
  capacity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameReferenceDto)
  @ApiProperty({ type: [NameReferenceDto] })
  vehicle_types_allowed?: NameReferenceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameReferenceDto)
  @ApiProperty({ type: [NameReferenceDto] })
  features?: NameReferenceDto[];
}
