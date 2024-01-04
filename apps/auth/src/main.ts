import { RmqService } from '@lib/src';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const rmqService = new RmqService(new ConfigService());
  const options = rmqService.getOptions('AUTH');
  const app = await NestFactory.createMicroservice(AuthModule, options);
  await app.listen();
}
bootstrap();
