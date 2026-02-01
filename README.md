# NestJS Template

A production-ready NestJS 11 starter template with TypeScript, Prisma ORM, standardized API responses, global error handling, and email support.

## Tech Stack

- **Runtime:** Node.js with TypeScript 5.7 (ES2023, `nodenext` module resolution)
- **Framework:** NestJS 11 on Express
- **Database:** PostgreSQL with Prisma 7 ORM
- **Validation:** class-validator + class-transformer
- **Email:** Nodemailer
- **Linting:** ESLint 9 (flat config) + Prettier

## Project Structure

```text
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── app.controller.ts                # Health check endpoint
├── app.service.ts                   # Health check service
├── types/
│   └── types.ts                     # Shared types (ResponseType<T>)
├── interceptors/
│   └── response.interceptor.ts      # Wraps all responses in ResponseType<T>
├── filters/
│   └── http-exception.filter.ts     # Global exception handler
├── middleware/
│   └── request-logger.middleware.ts  # Logs incoming requests and response times
├── prisma/
│   ├── prisma.module.ts             # Global Prisma module
│   └── prisma.service.ts            # Prisma client with lifecycle hooks
├── auth/
│   ├── auth.module.ts               # Auth feature module
│   ├── auth.controller.ts           # Auth endpoints
│   ├── auth.service.ts              # Auth business logic
│   └── dto/
│       └── register.dto.ts          # Registration validation DTO
├── mailer/
│   ├── mailer.module.ts             # Email module
│   └── mailer.service.ts            # Nodemailer transporter service
├── common/
│   ├── index.ts                     # Barrel exports
│   ├── constants/
│   │   └── error-codes.constants.ts # Centralized error code definitions
│   ├── exceptions/
│   │   ├── index.ts                 # Exception barrel exports
│   │   ├── app.exception.ts         # Base exception (extends HttpException)
│   │   ├── business.exception.ts    # 422 - Business logic violations
│   │   ├── conflict.exception.ts    # 409 - Duplicate resources
│   │   ├── entity-not-found.exception.ts  # 404 - Missing resources
│   │   └── forbidden-operation.exception.ts # 403 - Permission denied
│   └── mail-templates/
│       ├── reset-password-otp.ts    # OTP email HTML template
│       └── welcome-mail.ts          # Welcome email template (placeholder)
└── generated/
    └── prisma/                      # Auto-generated Prisma client (do not edit)
prisma/
├── schema.prisma                    # Database schema definition
└── migrations/                      # Database migration history
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
| --- | --- | --- |
| `PROJECT_NAME` | Application name (used in emails) | `nestjs-template` |
| `PREFIX` | API route prefix | `api` |
| `API_VERSION` | API version segment | `v1` |
| `PORT` | Server port (required, app exits if missing) | `8000` |
| `NODE_ENVIRONMENT` | Environment name for logging | `development` |
| `NODE_ENV` | Controls log format and levels | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NODE_MAILER_EMAIL` | Sender email address | `you@gmail.com` |
| `NODE_MAILER_APP_PASSWORD` | Email service app password | `xxxx xxxx xxxx xxxx` |
| `NODE_MAILER_PROVIDER` | Nodemailer transport service | `gmail` |

### Database Setup

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### Running the App

```bash
# Development (watch mode)
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run build
npm run start:prod
```

The app runs at `http://localhost:<PORT>/<PREFIX>/<API_VERSION>` (e.g., `http://localhost:8000/api/v1`).

## API Response Format

All endpoints return a uniform response shape:

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { },
  "error": null,
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["email must be an email"]
    }
  },
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

This is enforced globally by:

- **ResponseInterceptor** - Wraps successful responses into `ResponseType<T>`
- **HttpExceptionFilter** - Catches all exceptions and returns structured error responses

Both are registered via DI tokens (`APP_INTERCEPTOR` / `APP_FILTER`) in `AppModule`.

## Available Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health-check` | Health check (excluded from global prefix) |
| `POST` | `/<prefix>/<version>/auth/register` | User registration |

## Custom Exceptions

The template provides a hierarchy of typed exceptions that carry error codes:

| Exception | Status | Use Case |
| --- | --- | --- |
| `AppException` | 500 (default) | Base exception with error code and context |
| `BusinessException` | 422 | Business rule violations |
| `EntityNotFoundException` | 404 | Resource not found |
| `ConflictException` | 409 | Duplicate resource conflicts |
| `ForbiddenOperationException` | 403 | Permission denied |

Usage:

```typescript
throw new EntityNotFoundException('USER_NOT_FOUND');
throw new ConflictException('DUPLICATE_EMAIL');
throw new BusinessException('INVALID_CREDENTIALS', 'Custom message here');
```

Error codes are defined in `src/common/constants/error-codes.constants.ts`.

## Database

The template uses Prisma with PostgreSQL. The `PrismaService` is registered globally via `PrismaModule`, so it can be injected into any service:

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }
}
```

### Schema

The initial schema includes a `User` model:

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  first_name String
  last_name  String
  password   String
  createdAt  DateTime @default(now())
}
```

### Migrations

```bash
# Create a new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (destructive)
npx prisma migrate reset
```

## Logging

- **Development** (`NODE_ENV !== 'production'`): Colorized console output with all log levels (`log`, `error`, `warn`, `debug`, `verbose`)
- **Production** (`NODE_ENV === 'production'`): JSON format with `log`, `error`, `warn` only

Request logging middleware logs every incoming request and its response time automatically.

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:dev` | Development with watch mode |
| `npm run start:debug` | Debug mode with watch |
| `npm run start:prod` | Run compiled output |
| `npm test` | Run unit tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:cov` | Tests with coverage report |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier formatting |

## Code Style

- **Single quotes**, **trailing commas** everywhere
- `@typescript-eslint/no-explicit-any` is disabled
- Floating promises and unsafe arguments produce warnings
- Run `npm run lint` and `npm run format` before committing

## License

[UNLICENSED](package.json)
