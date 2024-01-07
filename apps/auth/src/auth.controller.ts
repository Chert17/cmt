import { RmqService } from '@lib/src';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AuthService } from './auth.service';
import {
  LoginServiceDto,
  RecoveryPasswordServiceDto,
  RegisterServiceDto,
} from './dto';

@Controller()
export class AuthController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('register')
  public register(
    @Payload() dto: RegisterServiceDto,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.authService.register(dto);
  }

  @MessagePattern('login')
  public login(@Payload() dto: LoginServiceDto, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.authService.login(dto);
  }

  @MessagePattern('refresh')
  public refresh(@Payload() refreshToken: string, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.authService.refresh(refreshToken);
  }

  @MessagePattern('recovery')
  public recovery(
    @Payload() dto: RecoveryPasswordServiceDto,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.authService.recovery(dto);
  }

  @MessagePattern('logout')
  public logout(@Payload() userId: string, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.authService.logout(userId);
  }
}

