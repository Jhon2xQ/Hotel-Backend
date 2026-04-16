import { describe, it, expect, beforeEach } from "vitest";
import { ListProductoPaginatedUseCase } from "../../../src/application/use-cases/producto/list-producto-paginated.use-case";
import { IProductoRepository } from "../../../src/domain/interfaces/producto.repository.interface";
import { createMockProducto } from "../../helpers/producto-fixtures";

describe("ListProductoPaginatedUseCase", () => {
  let useCase: ListProductoPaginatedUseCase;
  let mockRepo: IProductoRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockProducto(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findAllPaginated: async () => ({
        list: [createMockProducto({ codigo: "PROD-001" }), createMockProducto({ codigo: "PROD-002" })],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      }),
      update: async () => createMockProducto(),
      delete: async () => {},
    };

    useCase = new ListProductoPaginatedUseCase(mockRepo);
  });

  it("should return paginated productos", async () => {
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  it("should return empty list when no productos", async () => {
    mockRepo.findAllPaginated = async () => ({
      list: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });

  it("should map productos to DTOs", async () => {
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list[0]).toHaveProperty("id");
    expect(result.list[0]).toHaveProperty("codigo");
    expect(result.list[0]).toHaveProperty("precio_unitario");
  });
});