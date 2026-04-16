import { Producto } from "../../src/domain/entities/producto.entity";

export function createMockProducto(overrides?: Partial<Producto>): Producto {
  return new Producto(
    overrides?.id ?? "test-producto-id",
    overrides?.codigo ?? "PROD-001",
    overrides?.nombre ?? "Producto de Prueba",
    overrides?.descripcion ?? "Descripción del producto de prueba",
    overrides?.precioUnitario ?? 99.99,
    overrides?.stock ?? 10,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}