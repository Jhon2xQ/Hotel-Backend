import { describe, it, expect, beforeEach } from "vitest";
import { ListHuespedUseCase } from "../../../src/application/use-cases/huesped/list-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("ListHuespedUseCase", () => {
  let useCase: ListHuespedUseCase;
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

    useCase = new ListHuespedUseCase(mockRepository);
  });

  it("should return all huespedes", async () => {
    const mockHuespedes = [
      createMockHuesped({ id: "huesped-1", nombres: "Juan" }),
      createMockHuesped({ id: "huesped-2", nombres: "María" }),
    ];

    mockRepository.findAll = async () => mockHuespedes;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("huesped-1");
    expect(result[1].id).toBe("huesped-2");
  });

  it("should return empty array when no huespedes exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
