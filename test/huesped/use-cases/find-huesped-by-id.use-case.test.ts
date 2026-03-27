import { describe, it, expect, beforeEach } from "vitest";
import { FindHuespedByIdUseCase } from "../../../src/application/use-cases/huesped/find-huesped-by-id.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../src/domain/exceptions/huesped.exception";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("FindHuespedByIdUseCase", () => {
  let useCase: FindHuespedByIdUseCase;
  let mockRepository: IHuespedRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHuesped(),
      findAll: async () => [],
      findAllPaginated: async () => ({
        list: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }),
      findById: async () => null,
      findByEmail: async () => null,
      update: async () => createMockHuesped(),
      delete: async () => {},
    };

    useCase = new FindHuespedByIdUseCase(mockRepository);
  });

  it("should find huesped by id", async () => {
    const mockHuesped = createMockHuesped({ id: "test-huesped-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-huesped-id") return mockHuesped;
      return null;
    };

    const result = await useCase.execute("test-huesped-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-huesped-id");
  });

  it("should throw exception when huesped not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HuespedException);
  });
});
