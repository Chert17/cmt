import {
  LoginDto,
  LoginViewDto,
  RecoveryPasswordDto,
  RegisterDto,
  RegisterViewDto,
} from '@app/auth/src/dto';
import {
  ApiLogin,
  ApiLogout,
  ApiRecovery,
  ApiRefresh,
  ApiRegister,
} from '@app/auth/src/swagger';
import {
  JwtAuthGuard,
  LoggerInterceptor,
  RefreshAuthGuard,
  ReqUserId,
  SetRefreshTokenToCookieInterceptor,
} from '@lib/src';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
@UseInterceptors(LoggerInterceptor)
export class AuthGateway {
  constructor(@Inject('AUTH') private readonly authService: ClientProxy) {}

  @Post('/registration')
  @ApiRegister()
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterDto) {
    return lastValueFrom<RegisterViewDto>(
      this.authService.send('register', dto),
    );
  }

  @Post('/login')
  @ApiLogin()
  @UseInterceptors(SetRefreshTokenToCookieInterceptor)
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginDto) {
    return lastValueFrom<LoginViewDto>(this.authService.send('login', dto));
  }

  @Post('/refresh-token')
  @ApiRefresh()
  @UseGuards(RefreshAuthGuard)
  @UseInterceptors(SetRefreshTokenToCookieInterceptor)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() req: any) {
    const refreshToken = req.cookies['refreshToken'];
    return lastValueFrom<LoginViewDto>(
      this.authService.send('refresh', refreshToken),
    );
  }

  @Post('recovery-password')
  @ApiRecovery()
  @HttpCode(HttpStatus.OK)
  recovery(@Body() dto: RecoveryPasswordDto) {
    return lastValueFrom<RegisterViewDto>(
      this.authService.send('recovery', dto),
    );
  }

  @Post('/logout')
  @ApiLogout()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Res({ passthrough: true }) res: any,
    @ReqUserId() userId: string,
  ) {
    await lastValueFrom(this.authService.send('logout', userId));
    await res.clearCookie('refreshToken');
  }
}
