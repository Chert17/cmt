import { UploadDto } from '@app/file/src/dto';
import { JwtService, RpcException } from '@lib/src';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { compare, genSalt, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { extname } from 'path';
import { lastValueFrom } from 'rxjs';

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
    @Inject('FILE') private readonly fileService: ClientProxy,
  ) {}

  public async register(dto: RegisterServiceDto): Promise<RegisterViewDto> {
    try {
      const { username, password, avatar } = dto;
      const privateKey = randomUUID();
      const _id = new Types.ObjectId();

      const userData: RegisterRepoDto = {
        _id,
        username,
        password: await hash(password, await genSalt(10)),
        privateKey: await hash(privateKey, await genSalt(10)),
        avatar: avatar && `${_id}${extname(avatar.originalname)}`,
      };

      await this.authRepo.create(userData);

      const fileData: UploadDto = {
        file: avatar,
        folder: 'avatar',
        filename: _id.toString(),
      };

      await lastValueFrom(this.fileService.send('upload', fileData));

      return { privateKey, id: _id.toString() };
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

