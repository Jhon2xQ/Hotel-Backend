import { DomainException } from "./domain.exception";

export class FolioException extends DomainException {
  static notFoundById(id?: string): FolioException {
    const message = id ? `Folio con id "${id}" no encontrado` : "Folio no encontrado";
    return new FolioException(message, 404);
  }

  static notFoundByCodigo(codigo: string): FolioException {
    return new FolioException(`Folio con código "${codigo}" no encontrado`, 404);
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

  static alreadyHasPago(): FolioException {
    return new FolioException("El folio ya tiene un pago asociado", 400);
  }

  static estanciaNotFound(): FolioException {
    return new FolioException("La estancia especificada no existe", 404);
  }

  static estanciaHasOpenFolio(): FolioException {
    return new FolioException("La estancia ya tiene un folio abierto", 400);
  }

  static productoNotFound(): FolioException {
    return new FolioException("El producto especificado no existe", 404);
  }

  static promocionNotFound(): FolioException {
    return new FolioException("Una o más promociones especificadas no existen", 404);
  }

  static folioGenerationFailed(): FolioException {
    return new FolioException("No se pudo generar el código de folio. Intente nuevamente.", 500);
  }

  static cannotDeleteWithPago(): FolioException {
    return new FolioException("No se puede eliminar un folio que tiene un pago asociado", 403);
  }

  static cannotDeleteClosed(): FolioException {
    return new FolioException("No se puede eliminar un folio cerrado", 403);
  }
}
