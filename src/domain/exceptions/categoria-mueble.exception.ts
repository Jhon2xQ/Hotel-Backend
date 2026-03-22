import { DomainException } from "./domain.exception";

export class CategoriaMuebleException extends DomainException {
    static notFoundById(id: string): CategoriaMuebleException {
        return new CategoriaMuebleException(`Categoría de mueble con id "${id}" no encontrada`, 404);
    }

    static duplicateNombre(nombre: string): CategoriaMuebleException {
        return new CategoriaMuebleException(`Ya existe una categoría de mueble con el nombre "${nombre}"`, 409);
    }

    static invalidNombre(nombre: string): CategoriaMuebleException {
        return new CategoriaMuebleException(`El nombre "${nombre}" no es válido`, 400);
    }

}