import { ConfigModule, RmqModule } from '@lib/src';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, RmqModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

