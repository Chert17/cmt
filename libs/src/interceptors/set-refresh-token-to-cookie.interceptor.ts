import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { tap } from 'rxjs';

@Injectable()
export class SetRefreshTokenToCookieInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SetRefreshTokenToCookieInterceptor.name);
  constructor(private readonly config: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    try {
      const response = context.switchToHttp().getResponse<Response>();
      return next.handle().pipe(
        tap((result) => {
          response.cookie('refreshToken', result.refreshToken, {
            httpOnly: this.config.get('COOKIE_HTTP_ONLY'),
            secure: this.config.get('COOKIE_SECURE'),
          });
          delete result.refreshToken;
        }),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
