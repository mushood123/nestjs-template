import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodes } from '../constants/error-codes.constants';

export interface AppExceptionOptions {
  errorCode: ErrorCode;
  message?: string;
  statusCode?: HttpStatus;
  context?: Record<string, any>;
}

export class AppException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly context: Record<string, any>;

  constructor(options: AppExceptionOptions) {
    const {
      errorCode,
      message = ErrorCodes[errorCode],
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      context = {},
    } = options;

    super(message, statusCode);
    this.errorCode = errorCode;
    this.context = context;
  }
}
