import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto, PhoneDto, UserDto } from './users.dto';
import { UserTypeEnum } from '../../common/enums';
import { Type } from 'class-transformer';

export class PropertyOwnerLoginDTO {
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({ type: () => PhoneDto })
  phone: PhoneDto;
  @IsString()
  @ApiProperty({ default: 'Test@123' })
  password: string;
}

export class PropertyOwnerRegistrationDTO extends UserDto {
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @IsIn([UserTypeEnum.PROPERTY_OWNER])
  @ApiProperty({ default: UserTypeEnum.PROPERTY_OWNER })
  @IsOptional()
  user_type?: UserTypeEnum;
}

export class PropertyOwnerOtpRegistrationDTO {
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({ type: () => PhoneDto })
  phone: PhoneDto;
}

export class PropertyOwnerOtpRegistrationVerification {
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({ type: () => PhoneDto })
  phone: PhoneDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '123456' })
  otp: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: PhoneDto })
  @ValidateNested()
  @Type(() => PhoneDto)
  @IsOptional()
  phone?: PhoneDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password?: string;

  @ApiPropertyOptional()
  @IsEnum(['male', 'female', 'others'])
  @IsOptional()
  gender?: 'male' | 'female' | 'others';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ type: [AddressDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  addresses: AddressDto[];
}
