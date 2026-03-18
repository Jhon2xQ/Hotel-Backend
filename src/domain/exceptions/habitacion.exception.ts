import { DomainException } from "./domain.exception";

export class HabitacionException extends DomainException {
  static notFoundById(id: string): HabitacionException {
    return new HabitacionException(`Habitación con id "${id}" no encontrada`, 404);
  }

  static duplicateNumero(numero: string): HabitacionException {
    return new HabitacionException(`Ya existe una habitación con el número "${numero}"`, 409);
  }

  static hasRelatedRecords(): HabitacionException {
    return new HabitacionException(
      "No se puede eliminar la habitación porque tiene registros relacionados (estancias)",
      409,
    );
  }

  static tipoNotFound(tipoId: string): HabitacionException {
    return new HabitacionException(`Tipo de habitación con id "${tipoId}" no encontrado`, 404);
  }

  static muebleNotFound(muebleId: string): HabitacionException {
    return new HabitacionException(`Mueble con id "${muebleId}" no encontrado`, 404);
  }
}
