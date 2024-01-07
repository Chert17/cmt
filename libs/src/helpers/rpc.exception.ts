import { RpcException as NestRpcException } from '@nestjs/microservices';

export const RpcException = (exception: any, message: string) => {
  throw new NestRpcException(new exception(message));
};
