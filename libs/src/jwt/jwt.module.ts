import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { AccessTokenStrategy } from './access-token.strategy';
import { JwtService } from './jwt.service';
import { RefreshTokenStrategy } from './refresh-token.strategy';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: config.get('EXPIRESIN_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JwtService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class JwtModule {}
