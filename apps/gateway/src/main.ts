import { EnvEnum } from '@lib/src';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get(EnvEnum.PORT);
  await app.listen(port, async () => {
    console.log(`Application is running on: ${port}`);
  });
}
bootstrap();

