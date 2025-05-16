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
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    Logger.error(exception);
    response.status(status).json({
      code: status,
      data: null,
      message,
    });
  }
}
