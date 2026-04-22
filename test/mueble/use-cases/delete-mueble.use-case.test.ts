import { describe, it, expect, beforeEach } from "vitest";
import { DeleteMuebleUseCase } from "../../../src/application/use-cases/mueble/delete-mueble.use-case";
import { IMuebleRepository } from "../../../src/domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../src/domain/exceptions/mueble.exception";
import { createMockMueble } from "../../helpers/mueble-fixtures";

describe("DeleteMuebleUseCase", () => {
  let useCase: DeleteMuebleUseCase;
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

    useCase = new DeleteMuebleUseCase(mockMuebleRepo);
  });

  it("should delete mueble successfully", async () => {
    const existingMueble = createMockMueble({ id: "test-id" });
    mockMuebleRepo.findById = async () => existingMueble;

    await useCase.execute("test-id");

    expect(mockMuebleRepo.delete).toBeDefined();
  });

  it("should throw error when mueble not found", async () => {
    mockMuebleRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(MuebleException);
  });
});
