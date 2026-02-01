import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ConsoleLogger,
  LogLevel,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const PRODUCTION = process.env.NODE_ENV === 'production';
  const LOG_LEVELS: LogLevel[] = PRODUCTION
    ? ['log', 'error', 'warn']
    : ['log', 'error', 'warn', 'debug', 'verbose'];
  Logger.log(`Environment: ${process.env.NODE_ENVIRONMENT}`);
  const PORT = Number(process.env.PORT);
  if (!PORT) {
    Logger.error('PORT environment variable is not set');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: PRODUCTION,
      timestamp: true,
      colors: !PRODUCTION,
      logLevels: LOG_LEVELS,
    }),
  });

  const PREFIX = process.env.PREFIX;
  const API_VERSION = process.env.API_VERSION;
  if (PREFIX && API_VERSION) {
    app.setGlobalPrefix(`${PREFIX}/${API_VERSION}`, {
      exclude: ['health-check'],
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT);

  Logger.log(
    `Application is running on: ${await app.getUrl()}`,
    'NestApplication',
  );
}
bootstrap();
