import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class ApiError {
  field: string;
  message: string;
}

const errorsFormat = (err: ValidationError[]) => {
  const errors: ApiError[] = [];

  err.forEach((i) =>
    errors.push({
      field: i.property,
      message: Object.values(i.constraints)[0],
    }),
  );

  return errors;
};

export const GlobalValidationPipe = new ValidationPipe({
  exceptionFactory: (err: ValidationError[]) => {
    throw new BadRequestException(errorsFormat(err));
  },
  stopAtFirstError: true,
  transform: true,
  whitelist: true,
});
