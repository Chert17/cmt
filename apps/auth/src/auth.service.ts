import { JwtService, RpcException } from '@lib/src';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';

import {
  LoginServiceDto,
  LoginViewDto,
  RecoveryPasswordServiceDto,
  RegisterRepoDto,
  RegisterServiceDto,
  RegisterViewDto,
} from './dto';
import { AuthRepo } from './repo';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepo: AuthRepo,
  ) {}

  public async register(dto: RegisterServiceDto): Promise<RegisterViewDto> {
    try {
      const { username, password } = dto;
      const privateKey = randomUUID();

      const userData: RegisterRepoDto = {
        username,
        password: await hash(password, await genSalt(10)),
        privateKey: await hash(privateKey, await genSalt(10)),
      };

      const user = await this.authRepo.create(userData);

      return { privateKey, id: user._id.toString() };
    } catch (error) {
      this.logger.debug(error);
      RpcException(InternalServerErrorException, error);
    }
  }

  public async login(dto: LoginServiceDto): Promise<LoginViewDto> {
    const { username, password } = dto;

    const user = await this.authRepo.getUserByName(username);

    if (!user) {
      RpcException(UnauthorizedException, 'Incorrect username or password');
    }

    const pass = await compare(password, user.password);

    if (!pass) {
      RpcException(UnauthorizedException, 'Incorrect username or password');
    }

    const tokens = await this.jwtService.generateTokens(user._id);
    const iat = await this.jwtService.getTokenIat(tokens.refreshToken);
    const res = await this.authRepo.setIat(user._id, iat);

    if (!res) RpcException(UnauthorizedException, 'Can`t set new token');

    return tokens;
  }

  public async refresh(refreshToken: string): Promise<LoginViewDto> {
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!payload) RpcException(UnauthorizedException, 'Incorrect token');

    const user = await this.authRepo.getUserById(payload.sub);

    if (!user) RpcException(UnauthorizedException, 'Incorrect user');

    if (user.iat !== payload.iat) {
      RpcException(UnauthorizedException, 'Incorrect user');
    }

    const tokens = await this.jwtService.generateTokens(user._id);
    const iat = await this.jwtService.getTokenIat(tokens.refreshToken);
    const res = await this.authRepo.setIat(user._id, iat);

    if (!res) RpcException(UnauthorizedException, 'Can`t set new token');

    return tokens;
  }

  public async recovery(
    dto: RecoveryPasswordServiceDto,
  ): Promise<RegisterViewDto> {
    const { username, newPassword, privateKey } = dto;

    const user = await this.authRepo.getUserByName(username);

    if (!user) RpcException(NotFoundException, 'Not found user');

    const pk = await compare(privateKey, user.privateKey);

    if (!pk) RpcException(ForbiddenException, 'Incorrect private key');

    const newPk = randomUUID();
    const res = await this.authRepo.setNewPassword({
      _id: user._id,
      password: await hash(newPassword, await genSalt(10)),
      privateKey: await hash(newPk, await genSalt(10)),
    });

    if (!res) RpcException(UnauthorizedException, 'Can`t set new password');

    return { id: user._id.toString(), privateKey: newPk };
  }

  public async logout(userId: string) {
    try {
      return this.authRepo.setIat(new Types.ObjectId(userId), null);
    } catch (error) {
      this.logger.debug(error);
      RpcException(InternalServerErrorException, error);
    }
  }
}

