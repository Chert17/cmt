import { RegisterDto } from '@app/auth/src/dto';
import { LoggerInterceptor } from '@lib/src';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
@UseInterceptors(LoggerInterceptor)
export class AuthGateway {
  constructor(@Inject('AUTH') private readonly authService: ClientProxy) {}

  @Post('/registration')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterDto) {
    await lastValueFrom(this.authService.send('register', { dto }));
  }
}
