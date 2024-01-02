import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigModule, EnvEnum } from '../config';
import { RmqService } from './rabbitmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    const providers = [
      {
        inject: [ConfigService],
        provide: name,
        useFactory: (config: ConfigService) => {
          const user = config.get(EnvEnum.RABBITMQ_USER);
          const pass = config.get(EnvEnum.RABBITMQ_PASS);
          const host = config.get(EnvEnum.RABBITMQ_HOST);
          const queue = config.get(`RABBITMQ_${name}_QUEUE`);

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              queue,
              queueOptions: { durable: true },
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
