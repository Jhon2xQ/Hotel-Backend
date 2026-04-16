import { DomainException } from "./domain.exception";

export class InsumoBarException extends DomainException {
  static notFound(message = "Insumo de bar no encontrado"): InsumoBarException {
    return new InsumoBarException(message, 404);
  }

  static notFoundById(id: string): InsumoBarException {
    return new InsumoBarException(`Insumo de bar con ID ${id} no encontrado`, 404);
  }

  static alreadyExists(message = "El insumo de bar ya existe"): InsumoBarException {
    return new InsumoBarException(message, 409);
  }

  static conflictByCodigo(codigo: string): InsumoBarException {
    return new InsumoBarException(`Ya existe un insumo de bar con código ${codigo}`, 409);
  }

  static invalidData(message: string): InsumoBarException {
    return new InsumoBarException(message, 400);
  }

  static insufficientStock(insumoId: string, requested: number, available: number): InsumoBarException {
    return new InsumoBarException(
      `Stock insuficiente para el insumo ${insumoId}. Solicitado: ${requested}, disponible: ${available}`,
      400,
    );
  }
}