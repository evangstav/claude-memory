export class ApplicationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundError extends ApplicationError {
  constructor(entityName: string) {
    super(`Entity ${entityName} not found`, 404, 'ENTITY_NOT_FOUND');
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}