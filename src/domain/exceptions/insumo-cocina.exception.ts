import { DomainException } from "./domain.exception";

export class InsumoCocinaException extends DomainException {
  static notFound(message = "Insumo de cocina no encontrado"): InsumoCocinaException {
    return new InsumoCocinaException(message, 404);
  }

  static notFoundById(id: string): InsumoCocinaException {
    return new InsumoCocinaException(`Insumo de cocina con ID ${id} no encontrado`, 404);
  }

  static alreadyExists(message = "El insumo de cocina ya existe"): InsumoCocinaException {
    return new InsumoCocinaException(message, 409);
  }

  static conflictByCodigo(codigo: string): InsumoCocinaException {
    return new InsumoCocinaException(`Ya existe un insumo de cocina con código ${codigo}`, 409);
  }

  static invalidData(message: string): InsumoCocinaException {
    return new InsumoCocinaException(message, 400);
  }

  static insufficientStock(insumoId: string, requested: number, available: number): InsumoCocinaException {
    return new InsumoCocinaException(
      `Stock insuficiente para el insumo ${insumoId}. Solicitado: ${requested}, disponible: ${available}`,
      400,
    );
  }
}