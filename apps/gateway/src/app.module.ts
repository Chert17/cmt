import {
  ConfigModule,
  DatabaseModule,
  ExistUserByName,
  JwtModule,
  RmqModule,
} from '@lib/src';
import { Module } from '@nestjs/common';

import { AuthGateway } from './api';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    DatabaseModule,
    RmqModule.register('AUTH'),
  ],
  controllers: [AuthGateway],
  providers: [ExistUserByName],
})
export class AppModule {}

