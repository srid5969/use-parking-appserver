import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PropertyOwnerLoginDTO {
  @ApiProperty({ default: 'propertyowner@yopmail.com' })
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty({ default: 'Test@123' })
  password: string;
}
