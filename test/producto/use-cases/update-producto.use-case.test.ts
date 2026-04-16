import { describe, it, expect, beforeEach } from "vitest";
import { UpdateProductoUseCase } from "../../../src/application/use-cases/producto/update-producto.use-case";
import { IProductoRepository } from "../../../src/domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../src/domain/exceptions/producto.exception";
import { createMockProducto } from "../../helpers/producto-fixtures";

describe("UpdateProductoUseCase", () => {
  let useCase: UpdateProductoUseCase;
  let mockRepo: IProductoRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockProducto(),
      findAll: async () => [],
      findById: async () => createMockProducto(),
      findByCodigo: async () => null,
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      update: async () => createMockProducto({ nombre: "Producto Actualizado" }),
      delete: async () => {},
    };

    useCase = new UpdateProductoUseCase(mockRepo);
  });

  it("should update producto successfully", async () => {
    const input = {
      nombre: "Producto Actualizado",
      precio_unitario: 15.0,
      stock: 50,
    };

    const result = await useCase.execute("test-producto-id", input);

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Producto Actualizado");
  });

  it("should throw error when producto not found", async () => {
    mockRepo.findById = async () => null;

    const input = { nombre: "Nuevo Nombre" };

    await expect(useCase.execute("non-existent-id", input)).rejects.toThrow(ProductoException);
  });

  it("should throw error when codigo already exists", async () => {
    mockRepo.findByCodigo = async () => createMockProducto({ codigo: "PROD-NEW" });

    const input = { codigo: "PROD-NEW" };

    await expect(useCase.execute("test-producto-id", input)).rejects.toThrow(ProductoException);
  });
});