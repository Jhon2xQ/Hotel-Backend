export class DomainException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: Record<string, string[]>): DomainException {
    return new DomainException(message, 400, errors);
  }

  static unauthorized(message: string = "No autorizado"): DomainException {
    return new DomainException(message, 401);
  }

  static forbidden(message: string = "Acceso prohibido"): DomainException {
    return new DomainException(message, 403);
  }

  static notFound(message: string = "Recurso no encontrado"): DomainException {
    return new DomainException(message, 404);
  }

  static conflict(message: string, errors?: Record<string, string[]>): DomainException {
    return new DomainException(message, 409, errors);
  }

  static internal(message: string = "Error interno del servidor"): DomainException {
    return new DomainException(message, 500);
  }
}
