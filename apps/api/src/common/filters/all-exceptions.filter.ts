import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { ApiError } from '@pg/shared';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

/** Turns every thrown error into the one ApiError shape. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const isHttp = exception instanceof HttpException;
    const statusCode = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ApiError = {
      statusCode,
      code: HttpStatus[statusCode] ?? 'ERROR',
      // Never leak the message of an unexpected error; it is in the logs under requestId.
      message: isHttp ? messageOf(exception) : 'Internal server error',
      // Always a string: set by genReqId in app.module.ts.
      requestId: typeof request.id === 'string' ? request.id : 'unknown',
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    if (statusCode >= 500) {
      this.logger.error({ err: exception }, 'Request failed');
    }
    response.status(statusCode).json(body);
  }
}

function messageOf(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'object' && 'message' in response) {
    // Validation errors carry a list of messages.
    const { message } = response;
    if (Array.isArray(message)) return message.join('; ');
    if (typeof message === 'string') return message;
  }
  return exception.message;
}
