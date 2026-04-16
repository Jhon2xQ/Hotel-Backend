import { describe, it, expect, beforeEach } from "vitest";
import { ListFolioPaginatedUseCase } from "../../../src/application/use-cases/folio/list-folio-paginated.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("ListFolioPaginatedUseCase", () => {
  let useCase: ListFolioPaginatedUseCase;
  let mockRepository: IFolioRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByReservaId: async () => [],
      update: async () => createMockFolio(),
      delete: async () => {},
      close: async () => createMockFolio(),
    };

    useCase = new ListFolioPaginatedUseCase(mockRepository);
  });

  it("should return empty list when no folios exist", async () => {
    mockRepository.findAllPaginated = async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  it("should return paginated list of folios", async () => {
    const mockFolios = [
      createMockFolio({ id: "folio-1", nroFolio: 1 }),
      createMockFolio({ id: "folio-2", nroFolio: 2 }),
    ];

    mockRepository.findAllPaginated = async () => ({
      list: mockFolios,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toHaveLength(2);
    expect(result.list[0].id).toBe("folio-1");
    expect(result.list[1].id).toBe("folio-2");
    expect(result.pagination.total).toBe(2);
  });

  it("should map folio to dto correctly", async () => {
    const mockFolio = createMockFolio({
      id: "folio-1",
      nroFolio: 1,
      reservaId: "reserva-1",
      estado: true,
      promociones: ["PROMO-VERANO"],
    });

    mockRepository.findAllPaginated = async () => ({
      list: [mockFolio],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list[0]).toEqual({
      id: "folio-1",
      nro_folio: 1,
      reserva_id: "reserva-1",
      estado: true,
      observacion: null,
      cerrado_en: null,
      promociones: ["PROMO-VERANO"],
      created_at: mockFolio.createdAt.toISOString(),
      updated_at: mockFolio.updatedAt.toISOString(),
    });
  });

  it("should pass filters to repository", async () => {
    mockRepository.findAllPaginated = async (params) => {
      expect(params.reservaId).toBe("reserva-1");
      expect(params.estado).toBe(true);
      expect(params.page).toBe(2);
      expect(params.limit).toBe(5);
      return { list: [], pagination: { page: 2, limit: 5, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: true } };
    };

    await useCase.execute({
      page: 2,
      limit: 5,
      reservaId: "reserva-1",
      estado: true,
    });
  });
});