import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../common/services/storage.service';
import { fileFilter } from '../../common/utils/file-filter';

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
    const fileUrl = await this.storageService.uploadByFileType(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      file.buffer,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      file.originalname,
      fileType,
    );
    return { fileUrl };
  }
}
