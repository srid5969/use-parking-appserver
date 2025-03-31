import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AdminLoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
}

export class AddNewAdminDTO {
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
}
