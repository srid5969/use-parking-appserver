import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './configs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);
  Logger.log(`Application running on port ${config.port}`);
}
bootstrap().catch((error) => {
  Logger.error('Error during application bootstrap', error);
});
