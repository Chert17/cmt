// logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const clas = context.getClass().name;
    const method = context.getHandler().name;
    const url = request.originalUrl;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`Executed ${clas} url ${url} method ${method}`);
      }),
      catchError((error) => {
        this.logger.debug(
          `Error in ${clas} url ${url} method ${method}: ${error.message}`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
