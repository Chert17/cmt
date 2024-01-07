import { passwordRegex, usernameRegex } from '@lib/src';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
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
}

export class LoginServiceDto extends LoginDto {}

export class LoginViewDto {
  @ApiProperty()
  accessToken: string;
}
