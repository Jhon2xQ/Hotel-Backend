import { describe, it, expect, beforeEach } from "vitest";
import { ListHuespedPaginatedUseCase } from "../../../src/application/use-cases/huesped/list-huesped-paginated.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("ListHuespedPaginatedUseCase", () => {
  let useCase: ListHuespedPaginatedUseCase;
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

    useCase = new ListHuespedPaginatedUseCase(mockRepository);
  });

  it("should return paginated huespedes", async () => {
    const mockHuespedes = [
      createMockHuesped({ id: "huesped-1", nombres: "Juan" }),
      createMockHuesped({ id: "huesped-2", nombres: "María" }),
    ];

    mockRepository.findAllPaginated = async () => ({
      list: mockHuespedes,
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toHaveLength(2);
    expect(result.list[0].id).toBe("huesped-1");
    expect(result.list[1].id).toBe("huesped-2");
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(2);
    expect(result.pagination.totalPages).toBe(1);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it("should handle pagination with multiple pages", async () => {
    const mockHuespedes = [createMockHuesped({ id: "huesped-11" })];

    mockRepository.findAllPaginated = async () => ({
      list: mockHuespedes,
      pagination: {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });

    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.list).toHaveLength(1);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.total).toBe(25);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });

  it("should return empty array when no huespedes exist", async () => {
    mockRepository.findAllPaginated = async () => ({
      list: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });
});
