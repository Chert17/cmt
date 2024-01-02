import { ConfigModule, RmqModule } from '@lib/src';
import { Module } from '@nestjs/common';

import { AuthGateway } from './api';

@Module({
  imports: [ConfigModule, RmqModule.register({ name: 'AUTH' })],
  controllers: [AuthGateway],
})
export class AppModule {}
