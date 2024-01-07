import { apiBadRequestResponse, apiDefaultExceptionResponse } from '@lib/src';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import {
  LoginDto,
  LoginViewDto,
  RecoveryPasswordDto,
  RegisterDto,
  RegisterViewDto,
} from '../dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registration' }),
    ApiBody({ type: RegisterDto }),
    ApiBadRequestResponse(apiBadRequestResponse),
    ApiResponse({
      description: 'Success registration and returned private key for user',
      status: HttpStatus.OK,
      type: RegisterViewDto,
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login' }),
    ApiBody({ type: LoginDto }),
    ApiBadRequestResponse(apiBadRequestResponse),
    ApiResponse(
      apiDefaultExceptionResponse(
        'Unauthorized if incorrect credentials',
        HttpStatus.UNAUTHORIZED,
      ),
    ),
    ApiResponse({
      description:
        'Success login and returned pair tokens accessToken in body and refreshToken in cookie',
      status: HttpStatus.OK,
      type: LoginViewDto,
    }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Use this endpoint to refresh an expired access token by providing a valid refresh token. The refresh token should be sent in the cookie with the name refreshToken',
      description: 'Send refresh token in cookie',
    }),
    ApiCookieAuth('refreshToken'),
    ApiResponse(
      apiDefaultExceptionResponse(
        'Unauthorized if refreshToken missing in cookie, expired or incorrect',
        HttpStatus.UNAUTHORIZED,
      ),
    ),
    ApiResponse({
      description:
        'Success refresh and returned pair tokens accessToken in body and refreshToken in cookie',
      status: HttpStatus.OK,
      type: LoginViewDto,
    }),
  );
}

export function ApiRecovery() {
  return applyDecorators(
    ApiOperation({ summary: 'Recovery password' }),
    ApiBody({ type: RecoveryPasswordDto }),
    ApiBadRequestResponse(apiBadRequestResponse),
    ApiResponse(
      apiDefaultExceptionResponse('Not found user', HttpStatus.NOT_FOUND),
    ),
    ApiResponse(
      apiDefaultExceptionResponse(
        'Incorrect private key',
        HttpStatus.FORBIDDEN,
      ),
    ),
    ApiResponse({
      description:
        'Success recovery password and returned new private key for user',
      status: HttpStatus.OK,
      type: RegisterViewDto,
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout' }),
    ApiResponse(
      apiDefaultExceptionResponse('Not found user', HttpStatus.NOT_FOUND),
    ),
    ApiResponse({
      description: 'Success logout and clear refreshToken from cookie',
      status: HttpStatus.OK,
    }),
  );
}
