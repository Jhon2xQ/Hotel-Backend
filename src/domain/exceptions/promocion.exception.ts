import { DomainException } from "./domain.exception";

export class PromocionException extends DomainException {
  static notFoundById(): PromocionException {
    return new PromocionException("Promoción no encontrada", 404);
  }

  static duplicateCodigo(): PromocionException {
    return new PromocionException("Ya existe una promoción con ese código", 409);
  }

  static invalidDateRange(): PromocionException {
    return new PromocionException("La fecha de inicio debe ser anterior a la fecha de fin", 400);
  }

  static invalidValorDescuento(): PromocionException {
    return new PromocionException("El valor de descuento debe ser mayor a cero", 400);
  }
}
