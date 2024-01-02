export class RegisterDto {
  username: string;
  password: string;
}

export class RegisterServiceDto extends RegisterDto {}

export class RegisterViewDto {
  privateKey: string;
  id: string;
}
