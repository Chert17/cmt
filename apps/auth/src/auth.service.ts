import { TryCatchDec } from '@lib/src';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { RegisterServiceDto, RegisterViewDto } from './dto';

@Injectable()
@TryCatchDec()
export class AuthService {
  async register(dto: RegisterServiceDto): Promise<RegisterViewDto> {
    console.log('AuthService register dto :>> ', dto);
    return { id: 'qwe', privateKey: randomUUID() };
  }
}

