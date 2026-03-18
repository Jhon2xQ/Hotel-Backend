import { DomainException } from "./domain.exception";

export class TipoHabitacionException extends DomainException {
  static notFoundById(id: string): TipoHabitacionException {
    return new TipoHabitacionException(`Tipo de habitación con id "${id}" no encontrado`, 404);
  }

  static hasRelatedRecords(): TipoHabitacionException {
    return new TipoHabitacionException(
      "No se puede eliminar el tipo de habitación porque tiene registros relacionados (habitaciones, tarifas o reservas)",
      409,
    );
  }

  static muebleNotFound(muebleId: string): TipoHabitacionException {
    return new TipoHabitacionException(`Mueble con id "${muebleId}" no encontrado`, 404);
  }
}
