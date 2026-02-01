import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constants';
import { AppException } from './app.exception';

export class ForbiddenOperationException extends AppException {
  constructor(
    errorCode: ErrorCode = 'FORBIDDEN_OPERATION',
    message?: string,
    context?: Record<string, any>,
  ) {
    super({
      errorCode,
      message,
      statusCode: HttpStatus.FORBIDDEN,
      context,
    });
  }
}
