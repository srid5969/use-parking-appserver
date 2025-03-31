import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from './users.dto';
import { UserTypeEnum } from '../../common/enums';

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
