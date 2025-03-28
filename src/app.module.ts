import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './configs';
import { UsersModule } from './users/users.module';
import { UserSessionModule } from './user-session/user-session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.getOrThrow<string>('dbURI')}/${configService.getOrThrow<string>(
          'database',
        )}`,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UserSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
