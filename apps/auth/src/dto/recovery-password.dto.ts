import { IsString, IsUUID } from 'class-validator';
import { Types } from 'mongoose';

export class RecoveryPasswordDto {
  @IsString()
  username: string;

  @IsString()
  newPassword: string;

  @IsUUID()
  privateKey: string;
}

export class RecoveryPasswordServiceDto extends RecoveryPasswordDto {}

export class RecoveryPasswordRepoDto {
  _id: Types.ObjectId;
  password: string;
  privateKey: string;
}
