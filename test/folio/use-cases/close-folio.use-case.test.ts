import { describe, it, expect, beforeEach } from "vitest";
import { CloseFolioUseCase } from "../../../src/application/use-cases/folio/close-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("CloseFolioUseCase", () => {
  let useCase: CloseFolioUseCase;
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

    useCase = new CloseFolioUseCase(mockRepository);
  });

  it("should close folio successfully", async () => {
    const openFolio = createMockFolio({ id: "folio-1", estado: true });
    const closedFolio = createMockFolio({ id: "folio-1", estado: false, cerradoEn: new Date() });

    mockRepository.findById = async () => openFolio;
    mockRepository.close = async () => closedFolio;

    const result = await useCase.execute("folio-1");

    expect(result.estado).toBe(false);
    expect(result.cerrado_en).not.toBeNull();
  });

  it("should close folio with observacion", async () => {
    const openFolio = createMockFolio({ id: "folio-1", estado: true });
    const closedFolio = createMockFolio({
      id: "folio-1",
      estado: false,
      cerradoEn: new Date(),
      observacion: "Cierre por checkout",
    });

    mockRepository.findById = async () => openFolio;
    mockRepository.close = async () => closedFolio;
    mockRepository.update = async () => closedFolio;

    const result = await useCase.execute("folio-1", "Cierre por checkout");

    expect(result.estado).toBe(false);
    expect(result.observacion).toBe("Cierre por checkout");
  });

  it("should throw error when folio not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent")).rejects.toThrow(FolioException);
  });

  it("should throw error when folio already closed", async () => {
    const closedFolio = createMockFolio({ id: "folio-1", estado: false });
    mockRepository.findById = async () => closedFolio;

    await expect(useCase.execute("folio-1")).rejects.toThrow(FolioException);
  });
});