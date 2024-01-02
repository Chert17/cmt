import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

import { EnvEnum } from '../config';

@Injectable()
export class RmqService {
  constructor(private readonly config: ConfigService) {}

  getOptions(name: string, noAck = false): RmqOptions {
    const user = this.config.get(EnvEnum.RABBITMQ_USER);
    const pass = this.config.get(EnvEnum.RABBITMQ_PASS);
    const host = this.config.get(EnvEnum.RABBITMQ_HOST);
    const queue = this.config.get(`RABBITMQ_${name}_QUEUE`);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${pass}@${host}`],
        queue,
        noAck,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
