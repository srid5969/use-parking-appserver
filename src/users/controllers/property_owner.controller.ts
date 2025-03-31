import { Body, Controller, Post } from '@nestjs/common';
import { CommonSuccessResponseObject } from '../../common/consts';
import { PropertyOwnerLoginDTO } from '../dtos/property-owner.dtos';
import { PropertyOwnerLoginService } from '../services/property-owner/property-owner-login.service';

@Controller('property-owner')
export class PropertyOwnerController {
  constructor(private readonly loginService: PropertyOwnerLoginService) {}
  @Post('login')
  async loginController(@Body() body: PropertyOwnerLoginDTO) {
    const { email, password } = body;
    const data = await this.loginService.loginUsingEmailPassword(
      email,
      password,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
