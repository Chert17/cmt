import {
  Catch,
  RpcExceptionFilter as NestRpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter
  implements NestRpcExceptionFilter<RpcException>
{
  catch(e: RpcException): Observable<any> {
    return throwError(() => e);
  }
}
