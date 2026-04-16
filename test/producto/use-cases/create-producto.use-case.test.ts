import { describe, it, expect, beforeEach } from "vitest";
import { CreateProductoUseCase } from "../../../src/application/use-cases/producto/create-producto.use-case";
import { IProductoRepository } from "../../../src/domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../src/domain/exceptions/producto.exception";
import { createMockProducto } from "../../helpers/producto-fixtures";

describe("CreateProductoUseCase", () => {
  let useCase: CreateProductoUseCase;
  let mockRepo: IProductoRepository;

  beforeEach(() => {
    mockRepo = {
      create: async (data) => createMockProducto({ 
        codigo: data.codigo, 
        nombre: data.nombre,
        descripcion: data.descripcion ?? undefined,
        precioUnitario: data.precioUnitario,
        stock: data.stock ?? 0,
      }),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      update: async () => createMockProducto(),
      delete: async () => {},
    };

    useCase = new CreateProductoUseCase(mockRepo);
  });

  it("should create producto successfully", async () => {
    const input = {
      codigo: "PROD-001",
      nombre: "Cerveza Cristal",
      descripcion: "Cerveza rubia de 355ml",
      precio_unitario: 5.5,
      stock: 100,
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.codigo).toBe("PROD-001");
    expect(result.nombre).toBe("Cerveza Cristal");
    expect(result.precio_unitario).toBe(5.5);
    expect(result.stock).toBe(100);
  });

  it("should create producto with default stock", async () => {
    mockRepo.create = async (data) => createMockProducto({ codigo: data.codigo, nombre: data.nombre, stock: 0 });

    const input = {
      codigo: "PROD-002",
      nombre: "Agua Mineral",
      precio_unitario: 2.0,
    };

    const result = await useCase.execute(input);

    expect(result.stock).toBe(0);
  });

  it("should throw error when codigo already exists", async () => {
    mockRepo.findByCodigo = async () => createMockProducto();

    const input = {
      codigo: "PROD-001",
      nombre: "Producto Duplicado",
      precio_unitario: 10.0,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ProductoException);
  });
});