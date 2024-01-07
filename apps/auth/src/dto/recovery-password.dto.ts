import { passwordRegex, usernameRegex } from '@lib/src';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class RecoveryPasswordDto {
  @ApiProperty({
    description: 'Unique username of the user (5-16 characters).',
    uniqueItems: true,
    maxLength: 16,
    minLength: 5,
    pattern: String(usernameRegex),
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 16)
  @Matches(usernameRegex)
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    description: 'New password',
    example: 'MyP@ssw0rd',
    minLength: 8,
    pattern: String(passwordRegex),
  })
  @Matches(passwordRegex)
  @IsNotEmpty()
  @IsString()
  @Length(8)
  @Transform(({ value }) => value.trim())
  newPassword: string;

  @ApiProperty({ description: 'user private key', required: true })
  @IsUUID()
  privateKey: string;
}

export class RecoveryPasswordServiceDto extends RecoveryPasswordDto {}

export class RecoveryPasswordRepoDto {
  _id: Types.ObjectId;
  password: string;
  privateKey: string;
}
