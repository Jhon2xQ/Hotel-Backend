import { DomainException } from "./domain.exception";

export class HabitationException extends DomainException {
  static notFoundById(id: string): HabitationException {
    return new HabitationException(`Habitación con id "${id}" no encontrada`, 404);
  }

  static duplicateNumero(numero: string): HabitationException {
    return new HabitationException(`Ya existe una habitación con el número "${numero}"`, 409);
  }

  static invalidUUID(id: string): HabitationException {
    return new HabitationException(`El id "${id}" no es un UUID válido`, 400);
  }
}
