import { DomainException } from "./domain.exception";

export class ProductoException extends DomainException {
  static notFound(message = "Producto no encontrado"): ProductoException {
    return new ProductoException(message, 404);
  }

  static notFoundById(id: string): ProductoException {
    return new ProductoException(`Producto con ID ${id} no encontrado`, 404);
  }

  static alreadyExists(message = "El producto ya existe"): ProductoException {
    return new ProductoException(message, 409);
  }

  static conflictByCodigo(codigo: string): ProductoException {
    return new ProductoException(`Ya existe un producto con código ${codigo}`, 409);
  }

  static invalidData(message: string): ProductoException {
    return new ProductoException(message, 400);
  }

  static insufficientStock(productoId: string, requested: number, available: number): ProductoException {
    return new ProductoException(
      `Stock insuficiente para el producto ${productoId}. Solicitado: ${requested}, disponible: ${available}`,
      400,
    );
  }
}