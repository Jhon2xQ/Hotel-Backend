import { describe, it, expect, beforeEach } from "vitest";
import { FindFolioByIdUseCase } from "../../../src/application/use-cases/folio/find-folio-by-id.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio, createMockFolioWithPromociones } from "../../helpers/folio-fixtures";
import { Promocion } from "../../../src/domain/entities/promocion.entity";

describe("FindFolioByIdUseCase", () => {
  let useCase: FindFolioByIdUseCase;
  let mockRepository: IFolioRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByEstanciaId: async () => [],
      findByCodigo: async () => null,
      findOpenByEstanciaId: async () => null,
      update: async () => createMockFolio(),
      delete: async () => {},
      addProducto: async () => ({ id: "fp-1" } as any),
      addServicio: async () => ({ id: "fs-1" } as any),
      getConsumos: async () => ({ productos: [], servicios: [] }),
      getTotal: async () => 0,
      closeWithPago: async () => createMockFolio(),
    };

    useCase = new FindFolioByIdUseCase(mockRepository);
  });

  it("should find folio by id", async () => {
    const mockFolio = createMockFolio({ id: "folio-123", codigo: "FOL-260416-5" });
    mockRepository.findById = async () => mockFolio;

    const result = await useCase.execute("folio-123");

    expect(result.id).toBe("folio-123");
    expect(result.codigo).toBe("FOL-260416-5");
  });

  it("should throw error when folio not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent")).rejects.toThrow(FolioException);
  });

  it("should map folio entity to dto correctly", async () => {
    const mockFolio = createMockFolioWithPromociones({
      id: "folio-1",
      codigo: "FOL-260416-1",
      estanciaId: "estancia-1",
      estado: true,
      observacion: "Test",
    });

    mockRepository.findById = async () => mockFolio;

    const result = await useCase.execute("folio-1");

    expect(result.id).toBe("folio-1");
    expect(result.codigo).toBe("FOL-260416-1");
    expect(result.promociones).toHaveLength(2);
    expect(result.promociones[0].codigo).toBe("PROMO-VERANO");
  });
});
