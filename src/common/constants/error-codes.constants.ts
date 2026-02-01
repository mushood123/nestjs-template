export const ErrorCodes = {
  // Generic
  INTERNAL_ERROR: 'An unexpected error occurred',
  VALIDATION_ERROR: 'Validation failed',

  // Auth
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN_OPERATION: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid credentials',

  // Entity
  ENTITY_NOT_FOUND: 'The requested resource was not found',
  USER_NOT_FOUND: 'User not found',

  // Conflict
  CONFLICT: 'Resource conflict',
  DUPLICATE_EMAIL: 'A user with this email already exists',
  DUPLICATE_USERNAME: 'A user with this username already exists',
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
