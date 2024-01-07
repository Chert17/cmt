import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from './models';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
