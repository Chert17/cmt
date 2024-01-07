import { RmqService, RpcExceptionFilter } from '@lib/src';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { FileModule } from './file.module';

async function bootstrap() {
  const rmqService = new RmqService(new ConfigService());
  const options = rmqService.getOptions('FILE');
  const app = await NestFactory.createMicroservice(FileModule, options);
  app.useGlobalFilters(new RpcExceptionFilter());
  useContainer(app.select(FileModule), { fallbackOnErrors: true });
  await app.listen();
}
bootstrap();

