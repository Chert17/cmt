import { RmqService, RpcExceptionFilter } from '@lib/src';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const rmqService = new RmqService(new ConfigService());
  const options = rmqService.getOptions('AUTH');
  const app = await NestFactory.createMicroservice(AuthModule, options);
  app.useGlobalFilters(new RpcExceptionFilter());
  useContainer(app.select(AuthModule), { fallbackOnErrors: true });
  await app.listen();
}
bootstrap();
