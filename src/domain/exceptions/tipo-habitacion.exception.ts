import { DomainException } from "./domain.exception";

export class TipoHabitacionException extends DomainException {
  static notFoundById(): TipoHabitacionException {
    return new TipoHabitacionException("Tipo de habitación no encontrado", 404);
  }

  static hasRelatedRecords(): TipoHabitacionException {
    return new TipoHabitacionException(
      "No se puede eliminar el tipo de habitación porque tiene registros relacionados",
      409,
    );
  }

  static muebleNotFound(): TipoHabitacionException {
    return new TipoHabitacionException("Mueble no encontrado", 404);
  }
}
