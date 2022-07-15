import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigEnum } from './config/env.enum';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { raw } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    rawBody: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>(EnvConfigEnum.PORT);
  await app.listen(port);
  Logger.debug(`listening on port ${port}`);
}
bootstrap();
