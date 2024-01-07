import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly config: ConfigService,
  ) {}

  public async generateTokens(
    userId: Types.ObjectId,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('EXPIRESIN_REFRESH_TOKEN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  public async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: string; iat: number; exp: number }> {
    return this.jwtService.verify(token, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  public async verifyAccessToken(
    token: string,
  ): Promise<{ sub: string; iat: number; exp: number }> {
    return this.jwtService.verify(token, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  public async getTokenIat(token: string) {
    return this.jwtService.decode(token).iat;
  }
}
