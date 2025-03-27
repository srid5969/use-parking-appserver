import { IsEmail, IsString } from 'class-validator';

export class AdminLoginDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
