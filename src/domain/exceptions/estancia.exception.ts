import { DomainException } from "./domain.exception";

export class EstanciaException extends DomainException {
  static notFoundById(id?: string): EstanciaException {
    const message = id ? `Estancia con id "${id}" no encontrada` : "Estancia no encontrada";
    return new EstanciaException(message, 404);
  }

  static reservaNotFound(): EstanciaException {
    return new EstanciaException("La reserva especificada no existe", 404);
  }

  static habitacionNotFound(): EstanciaException {
    return new EstanciaException("La habitación especificada no existe", 404);
  }

  static huespedNotFound(): EstanciaException {
    return new EstanciaException("El huésped especificado no existe", 404);
  }

  static invalidDateRange(): EstanciaException {
    return new EstanciaException("La fecha de salida debe ser posterior a la fecha de entrada", 400);
  }

  static cannotModifyCompleted(): EstanciaException {
    return new EstanciaException("No se puede modificar una estancia completada", 403);
  }

  static alreadyCompleted(): EstanciaException {
    return new EstanciaException("La estancia ya está completada", 400);
  }

  static checkoutRequiresFechaSalida(): EstanciaException {
    return new EstanciaException("Debe proporcionar una fecha de salida para completar el checkout", 400);
  }
}
