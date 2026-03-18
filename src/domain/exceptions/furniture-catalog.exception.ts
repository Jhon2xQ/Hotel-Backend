import { DomainException } from "./domain.exception";

export class FurnitureCatalogException extends DomainException {
  static notFoundById(): FurnitureCatalogException {
    return new FurnitureCatalogException("Mueble no encontrado", 404);
  }

  static duplicateCodigo(): FurnitureCatalogException {
    return new FurnitureCatalogException("Ya existe un mueble con ese código", 409);
  }

  static habitacionNotFound(): FurnitureCatalogException {
    return new FurnitureCatalogException("La habitación no existe", 404);
  }
}
