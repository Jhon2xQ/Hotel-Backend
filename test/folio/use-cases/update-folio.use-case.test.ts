import { describe, it, expect, beforeEach } from "vitest";
import { UpdateFolioUseCase } from "../../../src/application/use-cases/folio/update-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio, createMockFolioWithPromociones } from "../../helpers/folio-fixtures";
import { Promocion } from "../../../src/domain/entities/promocion.entity";

describe("UpdateFolioUseCase", () => {
  let useCase: UpdateFolioUseCase;
  let mockFolioRepository: IFolioRepository;
  let mockPromocionRepository: IPromocionRepository;

  beforeEach(() => {
    mockFolioRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByReservaId: async () => [],
      findByCodigo: async () => null,
      update: async () => createMockFolio(),
      delete: async () => {},
      addProducto: async () => ({ id: "fp-1" } as any),
      addServicio: async () => ({ id: "fs-1" } as any),
      getConsumos: async () => ({ productos: [], servicios: [] }),
      getTotal: async () => 0,
      closeWithPago: async () => createMockFolio(),
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
    const mockPromo = new Promocion(
      "promo-1",
      "PROMO-VERANO",
      "PORCENTAJE",
      15,
      new Date("2025-01-01T00:00:00Z"),
      new Date("2027-12-31T23:59:59Z"),
      true,
      new Date(),
      new Date(),
    );
    const updatedFolio = createMockFolioWithPromociones({
      id: "folio-1",
    });

    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => mockPromo as any;
    mockFolioRepository.update = async () => updatedFolio;

    const result = await useCase.execute("folio-1", {
      promocionIds: ["promo-1"],
    });

    expect(result).toBeDefined();
  });

  it("should throw error when promocion is inactive on update", async () => {
    const inactivePromo = new Promocion(
      "promo-1",
      "PROMO-INACTIVE",
      "PORCENTAJE",
      15,
      new Date("2025-01-01T00:00:00Z"),
      new Date("2027-12-31T23:59:59Z"),
      false,
      new Date(),
      new Date(),
    );

    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => inactivePromo as any;

    await expect(
      useCase.execute("folio-1", { promocionIds: ["promo-1"] }),
    ).rejects.toThrow(FolioException.promocionInactive());
  });

  it("should throw error when promocion is expired on update", async () => {
    const expiredPromo = new Promocion(
      "promo-1",
      "PROMO-EXPIRED",
      "PORCENTAJE",
      15,
      new Date("2024-01-01T00:00:00Z"),
      new Date("2024-12-31T23:59:59Z"),
      true,
      new Date(),
      new Date(),
    );

    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => expiredPromo as any;

    await expect(
      useCase.execute("folio-1", { promocionIds: ["promo-1"] }),
    ).rejects.toThrow(FolioException.promocionExpired());
  });

  it("should throw error when promocion is not yet available on update", async () => {
    const futurePromo = new Promocion(
      "promo-1",
      "PROMO-FUTURE",
      "PORCENTAJE",
      15,
      new Date("2030-01-01T00:00:00Z"),
      new Date("2030-12-31T23:59:59Z"),
      true,
      new Date(),
      new Date(),
    );

    mockFolioRepository.findById = async () => createMockFolio({ id: "folio-1", estado: true });
    mockPromocionRepository.findById = async () => futurePromo as any;

    await expect(
      useCase.execute("folio-1", { promocionIds: ["promo-1"] }),
    ).rejects.toThrow(FolioException.promocionNotYetAvailable());
  });
});
