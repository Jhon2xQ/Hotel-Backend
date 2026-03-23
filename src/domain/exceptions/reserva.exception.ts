import { DomainException } from "./domain.exception";

export class ReservaException extends DomainException {
  static notFoundById(id?: string): ReservaException {
    const message = id ? `Reserva con id "${id}" no encontrada` : "Reserva no encontrada";
    return new ReservaException(message, 404);
  }

  static notFoundByCodigo(codigo: string): ReservaException {
    return new ReservaException(`Reserva con código "${codigo}" no encontrada`, 404);
  }

  static duplicateCodigo(codigo: string): ReservaException {
    return new ReservaException(`Ya existe una reserva con el código "${codigo}"`, 409);
  }

  static cannotModifyCompleted(): ReservaException {
    return new ReservaException("No se puede modificar una reserva completada. La reserva es inmutable.", 403);
  }

  static invalidDateRange(): ReservaException {
    return new ReservaException("La fecha de salida debe ser posterior a la fecha de entrada", 400);
  }

  static invalidAdultos(): ReservaException {
    return new ReservaException("Debe haber al menos 1 adulto en la reserva", 400);
  }

  static invalidNinos(): ReservaException {
    return new ReservaException("El número de niños no puede ser negativo", 400);
  }

  static huespedNotFound(): ReservaException {
    return new ReservaException("El huésped especificado no existe", 404);
  }

  static habitacionNotFound(): ReservaException {
    return new ReservaException("La habitación especificada no existe", 404);
  }

  static tarifaNotFound(): ReservaException {
    return new ReservaException("La tarifa especificada no existe", 404);
  }

  static pagoNotFound(): ReservaException {
    return new ReservaException("El pago especificado no existe", 404);
  }

  static cannotCancelCompleted(): ReservaException {
    return new ReservaException("No se puede cancelar una reserva completada", 403);
  }

  static alreadyCancelled(): ReservaException {
    return new ReservaException("La reserva ya está cancelada", 400);
  }

  static cancelRequiresMotivo(): ReservaException {
    return new ReservaException("Debe proporcionar un motivo de cancelación", 400);
  }
}
