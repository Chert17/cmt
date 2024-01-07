import { MulterFileType } from '@lib/src';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  avatar?: MulterFileType;
}

export class RegisterServiceDto extends RegisterDto {}

export class RegisterRepoDto {
  _id: Types.ObjectId;
  username: string;
  password: string;
  avatar?: string;
  privateKey: string;
}

export class RegisterViewDto {
  privateKey: string;
  id: string;
}
