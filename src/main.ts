import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      always: true,
      disableErrorMessages: false,
    }),
  );
  app.enableCors();
  app.enableVersioning();
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const config = new DocumentBuilder()
    .setTitle('Use My Parking App APIs')
    .setDescription('Use My Parking App APIs Document')
    .setVersion('1.0')
    .addBearerAuth({ name: 'JWT', type: 'http' }, 'JWT')
    .addServer(configService.getOrThrow<string>('serverBaseUrl'), 'App Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'API Document',
    customfavIcon: 'https://avatars.githubusercontent.com/u/12?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
  await app.listen(port);

  Logger.log(`Application running on port ${port}`);
}
bootstrap().catch((error) => {
  Logger.error('Error during application bootstrap', error);
});
