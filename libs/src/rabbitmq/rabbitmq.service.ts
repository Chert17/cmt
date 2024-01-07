import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly config: ConfigService) {}

  public getOptions(name: string, noAck = false): RmqOptions {
    const user = this.config.get('RABBITMQ_USER');
    const pass = this.config.get('RABBITMQ_PASS');
    const host = this.config.get('RABBITMQ_HOST');
    const queue = this.config.get(`RABBITMQ_${name}_QUEUE`);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${pass}@${host}`],
        queue,
        noAck,
        queueOptions: {
          arguments: {
            'x-max-retries': 3,
            'x-delivery-limit': 3,
          },
        },
      },
    };
  }

  public ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
