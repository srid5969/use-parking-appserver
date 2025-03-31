import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressType, UserStatus, UserTypeEnum } from '../../common/enums';

class PhoneDto {
  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsNumber()
  code?: number;
}

class AddressDto {
  _id?: string;

  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  pinCode?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  location?: [number, number];
}

export class UserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  phone?: PhoneDto;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'others'])
  gender?: 'male' | 'female' | 'others';

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  user_type?: UserTypeEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
