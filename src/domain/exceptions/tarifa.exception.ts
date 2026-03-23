import { DomainException } from "./domain.exception";

export class TarifaException extends DomainException {
  static notFoundById(): TarifaException {
    return new TarifaException("Tarifa no encontrada", 404);
  }

  static hasRelatedRecords(): TarifaException {
    return new TarifaException("No se puede eliminar la tarifa porque tiene registros relacionados", 409);
  }

  static tipoHabitacionNotFound(): TarifaException {
    return new TarifaException("Tipo de habitación no encontrado", 404);
  }

  static canalNotFound(): TarifaException {
    return new TarifaException("Canal no encontrado", 404);
  }

  static invalidPrecio(): TarifaException {
    return new TarifaException("El precio por noche debe ser mayor a 0", 400);
  }
}
