import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { AddressType, UserStatus, UserTypeEnum } from '../../common/enums';

class PhoneDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 1111111111 })
  number?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ default: 91 })
  code?: number;
}

class AddressDto {
  _id?: string;

  @IsOptional()
  @IsEnum(AddressType)
  @ApiProperty({ enum: AddressType })
  type?: AddressType;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Chennai' })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'Tamil Nadu' })
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '600 028' })
  pinCode?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: () => Array<number>,
    isArray: true,
    default: [80.2325252, 13.0560723],
  }) // <-- Explicitly define type
  location?: [number, number];
}

export class UserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ default: 'John Doe' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ default: 'example@yopmail.com' })
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty()
  phone?: PhoneDto;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @ApiProperty({ default: 'Password@1234' })
  password?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'others'])
  @ApiProperty({ default: 'male' })
  gender?: 'male' | 'female' | 'others';

  @IsOptional()
  @IsString()
  @ApiProperty()
  photo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  about?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  @ApiProperty({ default: UserTypeEnum.CUSTOMER })
  user_type?: UserTypeEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @ApiProperty({ type: () => AddressDto, isArray: true }) // <-- Explicitly define type
  addresses?: AddressDto[];

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  status?: UserStatus;
  createdBy?: string;
}
