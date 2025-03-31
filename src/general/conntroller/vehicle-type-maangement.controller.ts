import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { UserService } from '../../users/services/users/users-common.service';
import {
  AddNewFeatureDTO,
  UpdateFeatureDTO,
} from '../dtos/feature-managements.dto';
import { VehicleTypeManagementService } from '../services/vehicles-types.schema';
import {
  CreateNewVehicleTypeDto,
  UpdateVehicleTypeDto,
} from '../dtos/vehicle-type-management.dto';

@Controller('vehicle-type')
export class VehicleTypeManagementController {
  constructor(
    private readonly vehicleTypeManagementService: VehicleTypeManagementService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async createFeature(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() body: CreateNewVehicleTypeDto,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.vehicleTypeManagementService.createVehicleType(
      body,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get()
  async getAllFeatures(@Query() query: QueryParams) {
    const data =
      await this.vehicleTypeManagementService.getAllVehicleType(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get(':vehicleTypeId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getFeatureById(
    @Param('vehicleTypeId') vehicleTypeId: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data =
      await this.vehicleTypeManagementService.getVehicleTypeById(vehicleTypeId);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Put(':vehicleTypeId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async updateFeature(
    @Param('vehicleTypeId') vehicleTypeId: string,
    @Body() body: UpdateVehicleTypeDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.vehicleTypeManagementService.updateVehicleType(
      vehicleTypeId,
      body,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Delete(':vehicleTypeId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async deleteFeature(
    @Param('vehicleTypeId') vehicleTypeId: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(currentUser.userId);
    const data = await this.vehicleTypeManagementService.deleteVehicleTypeModel(
      vehicleTypeId,
      currentUser.userId,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
