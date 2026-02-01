import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();
    this.logger.log(`→ ${method} ${originalUrl}  | IP: ${ip}`);
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      this.logger.log(
        `← ${method} ${originalUrl} ${statusCode} | Duration: ${duration}ms`,
      );
    });
    next();
  }
}
