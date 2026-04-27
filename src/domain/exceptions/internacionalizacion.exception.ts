import { DomainException } from "./domain.exception";

export class InternacionalizacionException extends DomainException {
  static notFoundByHabitacionId(): InternacionalizacionException {
    return new InternacionalizacionException("Internacionalización no encontrada para esta habitación", 404);
  }

  static alreadyExists(): InternacionalizacionException {
    return new InternacionalizacionException("Ya existe una internacionalización para esta habitación", 409);
  }
}