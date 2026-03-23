import { DomainException } from "./domain.exception";

export class MuebleException extends DomainException {
  static notFoundById(): MuebleException {
    return new MuebleException("Mueble no encontrado", 404);
  }

  static duplicateCodigo(): MuebleException {
    return new MuebleException("Ya existe un mueble con ese código", 409);
  }

  static habitacionNotFound(): MuebleException {
    return new MuebleException("La habitación no existe", 404);
  }
}
