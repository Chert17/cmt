import { MulterFileType } from '@lib/src';

export class UploadDto {
  file: MulterFileType;
  folder: 'avatar' | 'logo' | 'banner' | 'chat-gpt';
  filename: string;
}
