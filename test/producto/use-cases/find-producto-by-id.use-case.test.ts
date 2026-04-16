import { describe, it, expect, beforeEach } from "vitest";
import { FindProductoByIdUseCase } from "../../../src/application/use-cases/producto/find-producto-by-id.use-case";
import { IProductoRepository } from "../../../src/domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../src/domain/exceptions/producto.exception";
import { createMockProducto } from "../../helpers/producto-fixtures";

describe("FindProductoByIdUseCase", () => {
  let useCase: FindProductoByIdUseCase;
  let mockRepo: IProductoRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockProducto(),
      findAll: async () => [],
      findById: async () => createMockProducto(),
      findByCodigo: async () => null,
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      update: async () => createMockProducto(),
      delete: async () => {},
    };

    useCase = new FindProductoByIdUseCase(mockRepo);
  });

  it("should return producto when found", async () => {
    const result = await useCase.execute("test-producto-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-producto-id");
  });

  it("should throw exception when not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(ProductoException);
  });
});