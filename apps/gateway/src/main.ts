import { GlobalExceptionFilter, GlobalValidationPipe } from '@lib/src';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('PORT');

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, () => {
    logger.verbose(`Application is running on: ${port}`);
  });
}
bootstrap();

