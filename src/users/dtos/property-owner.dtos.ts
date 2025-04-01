import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PhoneDto, UserDto } from './users.dto';
import { UserTypeEnum } from '../../common/enums';
import { Type } from 'class-transformer';

export class PropertyOwnerLoginDTO {
  @ApiProperty({ default: 'propertyowner@yopmail.com' })
  @IsEmail()
  email: string;
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
