import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constants';
import { AppException } from './app.exception';

export class ConflictException extends AppException {
  constructor(
    errorCode: ErrorCode = 'CONFLICT',
    message?: string,
    context?: Record<string, any>,
  ) {
    super({
      errorCode,
      message,
      statusCode: HttpStatus.CONFLICT,
      context,
    });
  }
}
