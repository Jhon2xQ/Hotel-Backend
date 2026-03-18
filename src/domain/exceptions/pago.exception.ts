import { DomainException } from "./domain.exception";

export class PagoException extends DomainException {
  static notFoundById(): PagoException {
    return new PagoException("Pago no encontrado", 404);
  }

  static personalNotFound(): PagoException {
    return new PagoException("Personal no encontrado", 404);
  }

  static invalidAmount(): PagoException {
    return new PagoException("El monto del pago debe ser mayor a cero", 400);
  }

  static cannotModifyApplied(): PagoException {
    return new PagoException("No se puede modificar un pago ya aplicado", 409);
  }
}
