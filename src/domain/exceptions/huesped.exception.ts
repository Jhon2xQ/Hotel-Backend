import { DomainException } from "./domain.exception";

export class HuespedException extends DomainException {
  static notFoundById(id: string): HuespedException {
    return new HuespedException(`Huésped con id "${id}" no encontrado`, 404);
  }

  static duplicateEmail(email: string): HuespedException {
    return new HuespedException(`Ya existe un huésped con el email "${email}"`, 409);
  }

  static invalidEmail(email: string): HuespedException {
    return new HuespedException(`El email "${email}" no es válido`, 400);
  }

  static invalidNivelVip(nivel: number): HuespedException {
    return new HuespedException(`El nivel VIP debe estar entre 0 y 2, recibido: ${nivel}`, 400);
  }
}
