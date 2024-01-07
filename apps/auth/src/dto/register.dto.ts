import {
  ExistUserByName,
  MulterFileType,
  passwordRegex,
  usernameRegex,
} from '@lib/src';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';

export class RegisterDto {
  @ApiProperty({
    description: 'Unique username of the user (5-16 characters).',
    uniqueItems: true,
    maxLength: 16,
    minLength: 5,
    pattern: String(usernameRegex),
  })
  @Validate(ExistUserByName)
  @IsNotEmpty()
  @IsString()
  @Length(5, 16)
  @Matches(usernameRegex)
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    description: 'password',
    example: 'MyP@ssw0rd',
    minLength: 8,
    pattern: String(passwordRegex),
  })
  @Matches(passwordRegex)
  @IsNotEmpty()
  @IsString()
  @Length(8)
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiPropertyOptional({
    description: 'user avatar photo',
    type: 'string',
    format: 'binary',
    required: false,
  })
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
  @ApiProperty()
  privateKey: string;

  @ApiProperty({ description: 'user id' })
  id: string;
}
