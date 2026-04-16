import { describe, it, expect, beforeEach } from "vitest";
import { DeleteProductoUseCase } from "../../../src/application/use-cases/producto/delete-producto.use-case";
import { IProductoRepository } from "../../../src/domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../src/domain/exceptions/producto.exception";
import { createMockProducto } from "../../helpers/producto-fixtures";

describe("DeleteProductoUseCase", () => {
  let useCase: DeleteProductoUseCase;
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

    useCase = new DeleteProductoUseCase(mockRepo);
  });

  it("should delete producto successfully", async () => {
    let deletedId: string | undefined;
    mockRepo.delete = async (id) => { deletedId = id; };

    await useCase.execute("test-producto-id");

    expect(deletedId).toBe("test-producto-id");
  });

  it("should throw error when producto not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(ProductoException);
  });
});