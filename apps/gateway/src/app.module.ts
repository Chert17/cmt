import { ConfigModule, JwtModule, RmqModule } from '@lib/src';
import { Module } from '@nestjs/common';

import { AuthGateway } from './api';

@Module({
  imports: [ConfigModule, JwtModule, RmqModule.register('AUTH')],
  controllers: [AuthGateway],
})
export class AppModule {}

