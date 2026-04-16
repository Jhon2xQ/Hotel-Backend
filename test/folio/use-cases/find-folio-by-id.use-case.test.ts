import { describe, it, expect, beforeEach } from "vitest";
import { FindFolioByIdUseCase } from "../../../src/application/use-cases/folio/find-folio-by-id.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("FindFolioByIdUseCase", () => {
  let useCase: FindFolioByIdUseCase;
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

    useCase = new FindFolioByIdUseCase(mockRepository);
  });

  it("should find folio by id", async () => {
    const mockFolio = createMockFolio({ id: "folio-123", nroFolio: 5 });
    mockRepository.findById = async () => mockFolio;

    const result = await useCase.execute("folio-123");

    expect(result.id).toBe("folio-123");
    expect(result.nro_folio).toBe(5);
  });

  it("should throw error when folio not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent")).rejects.toThrow(FolioException);
  });

  it("should map folio entity to dto correctly", async () => {
    const mockFolio = createMockFolio({
      id: "folio-1",
      nroFolio: 1,
      reservaId: "reserva-1",
      estado: true,
      observacion: "Test",
      promociones: ["PROMO-1", "PROMO-2"],
    });

    mockRepository.findById = async () => mockFolio;

    const result = await useCase.execute("folio-1");

    expect(result.id).toBe("folio-1");
    expect(result.promociones).toEqual(["PROMO-1", "PROMO-2"]);
  });
});