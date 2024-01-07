import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    try {
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const response: any = exception.getResponse();

        switch (status) {
          case HttpStatus.BAD_REQUEST:
            return res
              .status(status)
              .json({ errorsMessages: response.message });
          case HttpStatus.TOO_MANY_REQUESTS:
            return res
              .status(status)
              .json({ message: response.message.split(':')[1] });
          default:
            return res.status(status).json({ message: response.message });
        }
      }

      const { status, response } = exception.error;

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          return res.status(status).json({ errorsMessages: response.message });
        case HttpStatus.INTERNAL_SERVER_ERROR:
          return res.status(status).json({ message: exception.message });

        default:
          return res.status(status).json({ message: response.message });
      }
    } catch (e) {
      this.logger.error(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
    }
  }
}
