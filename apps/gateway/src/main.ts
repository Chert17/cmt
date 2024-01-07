import { GlobalExceptionFilter, GlobalValidationPipe } from '@lib/src';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { SwaggerTheme } from 'swagger-themes';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CMYTY Backend')
    .setDescription('Documentation API')
    .setVersion('1.0')
    .addBearerAuth({ bearerFormat: 'JWT', scheme: 'bearer', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const theme = new SwaggerTheme('v3');
  const options = { customCss: theme.getBuffer('dark') };

  SwaggerModule.setup('/', app, document, options);

  await app.listen(port, () => {
    logger.verbose(`Application is running on: ${port}`);
  });
}
bootstrap();

