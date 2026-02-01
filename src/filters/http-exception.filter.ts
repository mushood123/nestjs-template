import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ResponseType } from '../types/types';
import { AppException } from '../common/exceptions/app.exception';

interface ErrorResponsePayload {
  statusCode: number;
  message: string;
  errorCode: string | null;
  details: Record<string, string[]> | null;
}

interface ClientError {
  code?: string;
  details?: Record<string, string[]>;
}

interface ValidationExceptionResponse {
  message: string[];
  error: string;
  statusCode: number;
}

function isValidationResponse(
  value: unknown,
): value is ValidationExceptionResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    Array.isArray((value as ValidationExceptionResponse).message)
  );
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const payload = this.buildErrorPayload(exception);
    this.logException(exception, payload, request);

    const body: ResponseType<null> = {
      success: false,
      statusCode: payload.statusCode,
      message: payload.message,
      data: null,
      error: this.buildClientError(payload),
      timestamp: new Date().toISOString(),
    };

    response.status(payload.statusCode).json(body);
  }

  private buildErrorPayload(exception: unknown): ErrorResponsePayload {
    // Case 1: AppException (custom exceptions with error codes)
    if (exception instanceof AppException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
        errorCode: exception.errorCode,
        details: null,
      };
    }

    // Case 2: BadRequestException from ValidationPipe
    if (exception instanceof HttpException && exception.getStatus() === 400) {
      const exceptionResponse = exception.getResponse();
      if (isValidationResponse(exceptionResponse)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errorCode: 'VALIDATION_ERROR',
          details: this.formatdetails(exceptionResponse.message),
        };
      }
    }

    // Case 3: Standard HttpException
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
        errorCode: null,
        details: null,
      };
    }
    const err =
      exception instanceof Error ? exception.message : 'Unknown error';
    // Case 4: Unknown / unhandled exception
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err,
      errorCode: 'INTERNAL_ERROR',
      details: null,
    };
  }

  private formatdetails(messages: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};

    for (const msg of messages) {
      const spaceIndex = msg.indexOf(' ');
      if (spaceIndex > 0) {
        const property = msg.substring(0, spaceIndex);
        if (!grouped[property]) {
          grouped[property] = [];
        }
        grouped[property].push(msg);
      } else {
        if (!grouped['general']) {
          grouped['general'] = [];
        }
        grouped['general'].push(msg);
      }
    }

    return grouped;
  }

  private logException(
    exception: unknown,
    payload: ErrorResponsePayload,
    request: Request,
  ) {
    const logContext = {
      statusCode: payload.statusCode,
      path: request.url,
      method: request.method,
      errorCode: payload.errorCode,
      ...(exception instanceof AppException
        ? { context: exception.context }
        : {}),
    };

    if (payload.statusCode >= 500) {
      this.logger.error(
        `[${payload.errorCode ?? 'UNHANDLED'}] ${payload.message}`,
        exception instanceof Error ? exception.stack : undefined,
        JSON.stringify(logContext),
      );
    } else if (payload.statusCode >= 400) {
      this.logger.warn(
        `[${payload.errorCode ?? 'HTTP_ERROR'}] ${payload.message} | ${JSON.stringify(logContext)}`,
      );
    }
  }

  private buildClientError(
    payload: ErrorResponsePayload,
  ): ClientError | string {
    const error: ClientError = {};

    if (payload.errorCode) {
      error.code = payload.errorCode;
    }

    if (payload.details) {
      error.details = payload.details;
    }

    return Object.keys(error).length > 0 ? error : payload.message;
  }
}
