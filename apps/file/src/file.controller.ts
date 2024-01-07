import { RmqService } from '@lib/src';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { UploadDto } from './dto';
import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly fileService: FileService,
  ) {}

  @MessagePattern('upload')
  upload(@Payload() dto: UploadDto, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.fileService.uploadFile(dto);
  }
}

