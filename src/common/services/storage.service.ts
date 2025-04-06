import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lookup as mimeLookup } from 'mime-types';
import { extname } from 'path';
import { EnvironmentConfigType } from '../../configs';
import { Types } from 'mongoose';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService<EnvironmentConfigType>,
  ) {
    this.bucket = this.configService.getOrThrow<string>('aws_s3_bucket')!;
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('aws_region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('aws_access_key'),
        secretAccessKey: this.configService.getOrThrow('aws_secret_key'),
      },
    });
  }

  private async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    folder: string = 'uploads',
  ) {
    const fileExtension = extname(originalName);
    const lookupResult: string =
      mimeLookup(fileExtension) || 'application/octet-stream';

    const key = `${folder}/${new Types.ObjectId().toHexString()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: lookupResult,
    });

    try {
      await this.s3Client.send(command);
      const fileUrl = `https://${this.bucket}.s3.${this.configService.getOrThrow<string>('aws_region')}.amazonaws.com/${key}`;
      this.logger.log(`Uploaded to S3: ${fileUrl}`);
      return {
        // fileUrl,
        key: key,
        mimeType: lookupResult,
        originalName,
        fileExtension,
        fileSize: fileBuffer.length,
      };
    } catch (error) {
      this.logger.error(
        'S3 Upload Failed:',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async uploadProfileImage(fileBuffer: Buffer, originalName: string) {
    const data = await this.uploadFile(
      fileBuffer,
      originalName,
      'profile-images',
    );
    return data;
  }

  async uploadStaticImage(fileBuffer: Buffer, originalName: string) {
    const data = await this.uploadFile(
      fileBuffer,
      originalName,
      'static-images',
    );
    return data;
  }

  async uploadDocument(fileBuffer: Buffer, originalName: string) {
    const data = this.uploadFile(fileBuffer, originalName, 'documents');
    return data;
  }

  async uploadByFileType(
    fileBuffer: Buffer,
    originalName: string,
    fileType: string,
  ) {
    const data = await this.uploadFile(fileBuffer, originalName, fileType);
    return data;
  }

  async generateSignedUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }); // 1 hour
      return url;
    } catch (error) {
      if (error instanceof Error)
        this.logger.error(
          `Error generating signed URL for key: ${key}`,
          error.stack,
        );
      else
        this.logger.error(
          `Error generating signed URL for key: ${key}`,
          JSON.stringify(error),
        );

      throw error;
    }
  }
}
