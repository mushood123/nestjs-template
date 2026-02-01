import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constants';
import { AppException } from './app.exception';

export class EntityNotFoundException extends AppException {
  constructor(
    errorCode: ErrorCode = 'ENTITY_NOT_FOUND',
    message?: string,
    context?: Record<string, any>,
  ) {
    super({
      errorCode,
      message,
      statusCode: HttpStatus.NOT_FOUND,
      context,
    });
  }
}
