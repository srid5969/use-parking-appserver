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

export class AdminLoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
}

export class AddNewAdminDTO extends UserDto {
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @IsNotIn([UserTypeEnum.SUPER_ADMIN])
  @IsIn([UserTypeEnum.ADMIN])
  @ApiProperty({ default: UserTypeEnum.ADMIN })
  @IsOptional()
  user_type?: UserTypeEnum;
}

export class UpdateAdminDTO extends UserDto {
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @IsNotIn([UserTypeEnum.SUPER_ADMIN])
  @IsIn([UserTypeEnum.ADMIN])
  @ApiProperty({ default: UserTypeEnum.ADMIN })
  @IsOptional()
  user_type?: UserTypeEnum;
}
