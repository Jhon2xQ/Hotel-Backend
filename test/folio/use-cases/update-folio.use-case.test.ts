import { describe, it, expect, beforeEach } from "vitest";
import { UpdateFolioUseCase } from "../../../src/application/use-cases/folio/update-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("UpdateFolioUseCase", () => {
  let useCase: UpdateFolioUseCase;
  let mockFolioRepository: IFolioRepository;
  let mockPromocionRepository: IPromocionRepository;

  beforeEach(() => {
    mockFolioRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findById: async () => null,
      findByReservaId: async () => [],
      update: async () => createMockFolio(),
      delete: async () => {},
      close: async () => createMockFolio(),
    };

    mockPromocionRepository = {
      create: async () => ({ id: "promo-1" } as any),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findByCodigos: async () => [],
      findByIds: async () => [],
      update: async () => ({ id: "promo-1" } as any),
      delete: async () => {},
    };

    useCase = new UpdateFolioUseCase(mockFolioRepository, mockPromocionRepository);
  });

  it("should update folio observacion", async () => {
    const mockFolio = createMockFolio({ id: "folio-1", observacion: "Nueva observación" });
    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockFolioRepository.update = async () => mockFolio;

    const result = await useCase.execute("folio-1", {
      observacion: "Nueva observación",
    });

    expect(result).toBeDefined();
  });

  it("should throw error when folio not found", async () => {
    mockFolioRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent", { observacion: "Test" }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when trying to reopen a closed folio", async () => {
    const closedFolio = createMockFolio({ id: "folio-1", estado: false });
    mockFolioRepository.findById = async () => closedFolio;

    await expect(
      useCase.execute("folio-1", { estado: true }),
    ).rejects.toThrow(FolioException);
  });

  it("should validate promociones exist", async () => {
    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => null;

    await expect(
      useCase.execute("folio-1", { promocionIds: ["non-existent-promo"] }),
    ).rejects.toThrow(FolioException);
  });

  it("should update promociones successfully", async () => {
    const mockPromo = { id: "promo-1", codigo: "PROMO-VERANO" };
    const updatedFolio = createMockFolio({
      id: "folio-1",
      promociones: ["PROMO-VERANO"],
    });

    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => mockPromo as any;
    mockFolioRepository.update = async () => updatedFolio;

    const result = await useCase.execute("folio-1", {
      promocionIds: ["promo-1"],
    });

    expect(result).toBeDefined();
  });
});