/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseType } from '../types/types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseType<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseType<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    Logger.debug(`Response Status Code: ${statusCode}`);

    return next.handle().pipe(
      map((data) => {
        const isNestedResponse =
          data &&
          typeof data === 'object' &&
          ('result' in data || 'message' in data);

        return {
          success: true,
          statusCode,
          message: isNestedResponse ? data.message : 'Operation successful',
          data: (isNestedResponse ? data.result : data) ?? null,
          error: null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
