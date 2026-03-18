import { DomainException } from "./domain.exception";

export class FurnitureCatalogException extends DomainException {
  static notFoundById(id: string): FurnitureCatalogException {
    return new FurnitureCatalogException(`Mueble con id "${id}" no encontrado`, 404);
  }

  static duplicateCodigo(codigo: string): FurnitureCatalogException {
    return new FurnitureCatalogException(`Ya existe un mueble con el código "${codigo}"`, 409);
  }
}
