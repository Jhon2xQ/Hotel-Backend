import { DomainException } from "./domain.exception";

export class FolioException extends DomainException {
  static notFoundById(id?: string): FolioException {
    const message = id ? `Folio con id "${id}" no encontrado` : "Folio no encontrado";
    return new FolioException(message, 404);
  }

  static notFoundByNroFolio(nroFolio: number): FolioException {
    return new FolioException(`Folio con número "${nroFolio}" no encontrado`, 404);
  }

  static alreadyClosed(): FolioException {
    return new FolioException("El folio ya está cerrado", 400);
  }

  static alreadyOpen(): FolioException {
    return new FolioException("El folio ya está abierto", 400);
  }

  static cannotModifyClosed(): FolioException {
    return new FolioException("No se puede modificar un folio cerrado", 403);
  }

  static reservaNotFound(): FolioException {
    return new FolioException("La reserva especificada no existe", 404);
  }

  static promocionNotFound(): FolioException {
    return new FolioException("Una o más promociones especificadas no existen", 404);
  }

  static folioGenerationFailed(): FolioException {
    return new FolioException("No se pudo generar el número de folio. Intente nuevamente.", 500);
  }
}