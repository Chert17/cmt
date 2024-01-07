import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiDefaultError {
  @ApiProperty()
  message: string;
}

export class ApiError extends ApiDefaultError {
  @ApiProperty()
  field: string;
}

export class ApiErrorResponse {
  @ApiProperty({ type: [ApiError] })
  errorsMessages: ApiError[];
}

export const apiBadRequestResponse = {
  description: 'Bad Request',
  status: HttpStatus.BAD_REQUEST,
  type: ApiErrorResponse,
};

export const apiDefaultExceptionResponse = (
  description: string,
  status: HttpStatus,
) => {
  return { description, status, type: ApiDefaultError };
};
