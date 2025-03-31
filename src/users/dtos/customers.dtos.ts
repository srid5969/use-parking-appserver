import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from './users.dto';
import { UserTypeEnum } from '../../common/enums';

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
