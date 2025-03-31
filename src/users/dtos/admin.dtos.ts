import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
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
  @IsNotIn([UserTypeEnum.ADMIN])
  @ApiProperty()
  user_type?: UserTypeEnum;
}
