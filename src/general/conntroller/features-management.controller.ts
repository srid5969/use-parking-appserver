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
import { FeatureManagementService } from '../services/features.service';
import { UserService } from '../../users/services/users/users-common.service';
import {
  AddNewFeatureDTO,
  UpdateFeatureDTO,
} from '../dtos/feature-managements.dto';
import { CommonSuccessResponseObject } from '../../common/consts';
import {
  CurrentUser,
  GetCurrentUser,
} from '../../common/decorators/current-users.decorator';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonAuthGuard } from '../../common/auth/auth-guard';

@Controller('features-management')
export class FeaturesManagementController {
  constructor(
    private readonly featuresManagementService: FeatureManagementService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async createFeature(
    @GetCurrentUser() currentUser: CurrentUser,
    @Body() body: AddNewFeatureDTO,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.featuresManagementService.createFeature(body);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get()
  async getAllFeatures(@Query() query: QueryParams) {
    const data = await this.featuresManagementService.getAllFeatures(query);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get(':featureId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async getFeatureById(
    @Param('featureId') featureId: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.featuresManagementService.getFeatureById(featureId);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Put(':featureId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async updateFeature(
    @Param('featureId') featureId: string,
    @Body() body: UpdateFeatureDTO,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.featuresManagementService.updateFeature(
      featureId,
      body,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Delete(':featureId')
  @ApiBearerAuth('JWT')
  @UseGuards(CommonAuthGuard)
  async deleteFeature(
    @Param('featureId') featureId: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.userService.validateIfUserIsSuperAdmin(
      currentUser.userId as string,
    );
    const data = await this.featuresManagementService.deleteFeature(featureId);
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }
}
