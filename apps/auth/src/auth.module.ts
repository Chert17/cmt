import { ConfigModule, DatabaseModule, JwtModule, RmqModule } from '@lib/src';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepo } from './repo';

@Module({
  imports: [ConfigModule, RmqModule, JwtModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo],
})
export class AuthModule {}

