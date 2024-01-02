import { RmqService } from '@lib/src';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUTH'));

  await app.startAllMicroservices();
}
bootstrap();
