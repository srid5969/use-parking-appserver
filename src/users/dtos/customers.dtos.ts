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
import { UserTypeEnum } from '../../common/enums';
import { PhoneDto, UserDto } from './users.dto';
import { Type } from 'class-transformer';

export class CustomerLoginDTO {
  @ApiProperty({ default: 'customer@yopmail.com' })
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty({ default: 'Test@123' })
  password: string;
}

export class CustomerRegistrationDTO extends UserDto {
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @IsIn([UserTypeEnum.CUSTOMER])
  @ApiProperty({ default: UserTypeEnum.CUSTOMER })
  @IsOptional()
  user_type?: UserTypeEnum;
}

export class CustomerOtpRegistrationDTO {
  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({ type: () => PhoneDto })
  phone: PhoneDto;
}
