import { describe, it, expect, beforeEach } from "vitest";
import { FindMuebleByIdUseCase } from "../../../src/application/use-cases/mueble/find-mueble-by-id.use-case";
import { IMuebleRepository } from "../../../src/domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../src/domain/exceptions/mueble.exception";
import { createMockMueble } from "../../helpers/mueble-fixtures";

describe("FindMuebleByIdUseCase", () => {
  let useCase: FindMuebleByIdUseCase;
  let mockMuebleRepo: IMuebleRepository;

  beforeEach(() => {
    mockMuebleRepo = {
      create: async () => createMockMueble(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockMueble(),
      delete: async () => {},
    };

    useCase = new FindMuebleByIdUseCase(mockMuebleRepo);
  });

  it("should return mueble when found", async () => {
    const mockMueble = createMockMueble({ id: "test-id", codigo: "CAMA-001" });
    mockMuebleRepo.findById = async () => mockMueble;

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.codigo).toBe("CAMA-001");
  });

  it("should throw error when mueble not found", async () => {
    mockMuebleRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(MuebleException);
  });
});
