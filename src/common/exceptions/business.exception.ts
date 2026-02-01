import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constants';
import { AppException } from './app.exception';

export class BusinessException extends AppException {
  constructor(
    errorCode: ErrorCode,
    message?: string,
    context?: Record<string, any>,
  ) {
    super({
      errorCode,
      message,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      context,
    });
  }
}
