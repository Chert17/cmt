import { RmqService } from '@lib/src';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { RegisterServiceDto } from './dto';

@Controller()
export class AuthController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('register')
  async register(
    @Payload() data: RegisterServiceDto,
    @Ctx() context: RmqContext,
  ) {
    const res = await this.authService.register(data);
    this.rmqService.ack(context);
    return res;
  }
}

