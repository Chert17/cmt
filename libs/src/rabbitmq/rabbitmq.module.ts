import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigModule } from '../config';
import { RmqService } from './rabbitmq.service';

@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(name: string): DynamicModule {
    const providers = [
      {
        inject: [ConfigService],
        provide: name,
        useFactory: (config: ConfigService) => {
          const user = config.get('RABBITMQ_USER');
          const pass = config.get('RABBITMQ_PASS');
          const host = config.get('RABBITMQ_HOST');
          const queue = config.get(`RABBITMQ_${name}_QUEUE`);

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              queue,
              queueOptions: {
                durable: true,
                arguments: {
                  'x-max-retries': 3,
                  'x-delivery-limit': 3,
                },
              },
              urls: [`amqp://${user}:${pass}@${host}`],
              noAck: true,
            },
          });
        },
      },
    ];

    return {
      module: RmqModule,
      providers,
      exports: providers,
    };
  }
}
