import { DomainException } from "./domain.exception";

export class HabitacionException extends DomainException {
  static notFoundById(): HabitacionException {
    return new HabitacionException("Habitación no encontrada", 404);
  }

  static duplicateNumero(): HabitacionException {
    return new HabitacionException("Ya existe una habitación con ese número", 409);
  }

  static hasRelatedRecords(): HabitacionException {
    return new HabitacionException("No se puede eliminar la habitación porque tiene registros relacionados", 409);
  }

  static tipoNotFound(): HabitacionException {
    return new HabitacionException("Tipo de habitación no encontrado", 404);
  }

  static muebleNotFound(): HabitacionException {
    return new HabitacionException("Mueble no encontrado", 404);
  }
}
