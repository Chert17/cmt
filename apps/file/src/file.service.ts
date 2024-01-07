import { RpcException } from '@lib/src';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { extname, join } from 'path';

import { UploadDto } from './dto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  public async uploadFile(dto: UploadDto) {
    try {
      const { file, folder, filename } = dto;

      const filenameWithExt = `${filename}${extname(file.originalname)}`;
      const filePath = join(process.cwd(), 'images', folder);

      try {
        await fs.access(filePath);
      } catch (error) {
        await fs.mkdir(filePath, { recursive: true });
      }

      const files = await fs.readdir(filePath);
      const oldImg = files.find((f) => f.split('.')[0] === filename);

      if (oldImg) await fs.unlink(join(filePath, oldImg));

      const buffer = Buffer.from(file.buffer);
      await fs.writeFile(join('images', folder, filenameWithExt), buffer);

      return filenameWithExt;
    } catch (error) {
      this.logger.debug(error);
      RpcException(InternalServerErrorException, 'Can`t upload file');
    }
  }

  public async deleteFile(path: string, filename: string) {
    const directoryPath = join(process.cwd(), 'images', path);

    try {
      const files = await fs.readdir(directoryPath);
      const file = files.find((f) => f.split('.')[0] === filename);
      await fs.unlink(join(directoryPath, file));
    } catch (error) {
      this.logger.debug(error);
      RpcException(InternalServerErrorException, 'Can`t delete file');
    }
  }
}

