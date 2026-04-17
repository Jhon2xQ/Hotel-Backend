import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateFolioUseCase } from "../../../src/application/use-cases/folio/create-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IEstanciaRepository } from "../../../src/domain/interfaces/estancia.repository.interface";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio, createMockFolioWithPromociones } from "../../helpers/folio-fixtures";
import { Estancia } from "../../../src/domain/entities/estancia.entity";
import { Promocion } from "../../../src/domain/entities/promocion.entity";

describe("CreateFolioUseCase", () => {
  let useCase: CreateFolioUseCase;
  let mockFolioRepository: IFolioRepository;
  let mockEstanciaRepository: IEstanciaRepository;
  let mockPromocionRepository: IPromocionRepository;

  beforeEach(() => {
    mockFolioRepository = {
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

    mockEstanciaRepository = {
      create: async () => ({ id: "estancia-1" } as unknown as Estancia),
      findAll: async () => [],
      findById: async () => null,
      findByReservaId: async () => [],
      update: async () => ({ id: "estancia-1" } as unknown as Estancia),
      delete: async () => {},
      checkout: async () => ({ id: "estancia-1" } as unknown as Estancia),
    };

    mockPromocionRepository = {
      create: async () => ({ id: "promo-1", codigo: "PROMO-1" } as any),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findByCodigos: async () => [],
      findByIds: async () => [],
      update: async () => ({ id: "promo-1" } as any),
      delete: async () => {},
    };

    useCase = new CreateFolioUseCase(mockFolioRepository, mockEstanciaRepository, mockPromocionRepository);
  });

  it("should create folio successfully", async () => {
    const mockEstancia = { id: "estancia-1" };
    const mockFolio = createMockFolio({ estanciaId: "estancia-1" });

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.create = async () => mockFolio;
    mockFolioRepository.findOpenByEstanciaId = async () => null;

    const result = await useCase.execute({
      estanciaId: "estancia-1",
    });

    expect(result).toBeDefined();
    expect(result.estanciaId).toBe("estancia-1");
  });

  it("should create folio with promociones", async () => {
    const mockEstancia = { id: "estancia-1" };
    const mockPromo1 = new Promocion("promo-1", "PROMO-VERANO", "PORCENTAJE", 15, new Date("2025-01-01T00:00:00Z"), new Date("2027-12-31T23:59:59Z"), true, new Date(), new Date());
    const mockPromo2 = new Promocion("promo-2", "PROMO-INVIERNO", "MONTO_FIJO", 500, new Date("2025-01-01T00:00:00Z"), new Date("2027-12-31T23:59:59Z"), true, new Date(), new Date());
    const mockFolio = createMockFolioWithPromociones({
      estanciaId: "estancia-1",
    });

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => null;
    mockPromocionRepository.findById = async (id: string) => {
      if (id === "promo-1") return mockPromo1 as any;
      if (id === "promo-2") return mockPromo2 as any;
      return null;
    };
    mockFolioRepository.create = async () => mockFolio;

    const result = await useCase.execute({
      estanciaId: "estancia-1",
      promocionIds: ["promo-1", "promo-2"],
    });

    expect(result.promociones).toHaveLength(2);
    expect(result.promociones[0].codigo).toBe("PROMO-VERANO");
    expect(result.promociones[1].codigo).toBe("PROMO-INVIERNO");
  });

  it("should throw error when estancia not found", async () => {
    mockEstanciaRepository.findById = async () => null;

    await expect(
      useCase.execute({
        estanciaId: "non-existent-estancia",
      }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when estancia already has open folio", async () => {
    const mockEstancia = { id: "estancia-1" };
    const existingOpenFolio = createMockFolio({ estado: true });

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => existingOpenFolio;

    await expect(
      useCase.execute({
        estanciaId: "estancia-1",
      }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when promocion not found", async () => {
    const mockEstancia = { id: "estancia-1" };
    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => null;
    mockPromocionRepository.findById = async () => null;

    await expect(
      useCase.execute({
        estanciaId: "estancia-1",
        promocionIds: ["non-existent-promo"],
      }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when promocion is inactive", async () => {
    const mockEstancia = { id: "estancia-1" };
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

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => null;
    mockPromocionRepository.findById = async () => inactivePromo as any;

    await expect(
      useCase.execute({
        estanciaId: "estancia-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionInactive());
  });

  it("should throw error when promocion is expired", async () => {
    const mockEstancia = { id: "estancia-1" };
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

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => null;
    mockPromocionRepository.findById = async () => expiredPromo as any;

    await expect(
      useCase.execute({
        estanciaId: "estancia-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionExpired());
  });

  it("should throw error when promocion is not yet available", async () => {
    const mockEstancia = { id: "estancia-1" };
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

    mockEstanciaRepository.findById = async () => mockEstancia as unknown as Estancia;
    mockFolioRepository.findOpenByEstanciaId = async () => null;
    mockPromocionRepository.findById = async () => futurePromo as any;

    await expect(
      useCase.execute({
        estanciaId: "estancia-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionNotYetAvailable());
  });
});
