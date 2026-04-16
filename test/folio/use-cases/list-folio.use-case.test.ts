import { describe, it, expect, beforeEach } from "vitest";
import { ListFolioUseCase } from "../../../src/application/use-cases/folio/list-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("ListFolioUseCase", () => {
  let useCase: ListFolioUseCase;
  let mockRepository: IFolioRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findById: async () => null,
      findByReservaId: async () => [],
      update: async () => createMockFolio(),
      delete: async () => {},
      close: async () => createMockFolio(),
    };

    useCase = new ListFolioUseCase(mockRepository);
  });

  it("should return empty array when no folios exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should return list of folios", async () => {
    const mockFolios = [
      createMockFolio({ id: "folio-1", nroFolio: 1 }),
      createMockFolio({ id: "folio-2", nroFolio: 2 }),
    ];

    mockRepository.findAll = async () => mockFolios;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("folio-1");
    expect(result[1].id).toBe("folio-2");
  });

  it("should map folio to dto correctly", async () => {
    const mockFolio = createMockFolio({
      id: "folio-1",
      nroFolio: 1,
      reservaId: "reserva-1",
      estado: true,
      promociones: ["PROMO-VERANO"],
    });

    mockRepository.findAll = async () => [mockFolio];

    const result = await useCase.execute();

    expect(result[0]).toEqual({
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
});