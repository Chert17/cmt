import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().required().default(3000),
        RABBITMQ_DEFAULT_USER: Joi.string().required().default('user'),
        RABBITMQ_DEFAULT_PASS: Joi.string().required().default('pass'),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_AUTH_QUEUE: Joi.string().required(),
        COOKIE_HTTP_ONLY: Joi.boolean().required().default(false),
        COOKIE_SECURE: Joi.boolean().required().default(false),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        EXPIRESIN_ACCESS_TOKEN: Joi.string().required(),
        EXPIRESIN_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
