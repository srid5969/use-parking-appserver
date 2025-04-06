import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../common/services/storage.service';
import { fileFilter } from '../../common/utils/file-filter';
import { CommonSuccessResponseObject } from '../../common/consts';

@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post(':folder')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') fileType: string,
  ) {
    const data = await this.storageService.uploadByFileType(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      file.buffer,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      file.originalname,
      fileType,
    );
    const result = {
      ...CommonSuccessResponseObject,
      data,
    };
    return result;
  }

  @Get('signed-url')
  async getSignedUrl(@Query('key') key: string) {
    if (!key) {
      return { error: 'Missing file key' };
    }

    const signedUrl = await this.storageService.generateSignedUrl(key);
    return { signedUrl };
  }
}
