import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class LoginServiceDto extends LoginDto {}

export class LoginViewDto {
  accessToken: string;
}
