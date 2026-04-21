import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateFolioUseCase } from "../../../src/application/use-cases/folio/create-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio, createMockFolioWithPromociones } from "../../helpers/folio-fixtures";
import { Reserva } from "../../../src/domain/entities/reserva.entity";
import { Promocion } from "../../../src/domain/entities/promocion.entity";

describe("CreateFolioUseCase", () => {
  let useCase: CreateFolioUseCase;
  let mockFolioRepository: IFolioRepository;
  let mockReservaRepository: IReservaRepository;
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

    mockReservaRepository = {
      create: async () => ({ id: "reserva-1" } as unknown as Reserva),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByCodigo: async () => null,
      findConflictingReservations: async () => [],
      update: async () => ({ id: "reserva-1" } as unknown as Reserva),
      delete: async () => {},
      cancel: async () => ({ id: "reserva-1" } as unknown as Reserva),
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

    useCase = new CreateFolioUseCase(mockFolioRepository, mockReservaRepository, mockPromocionRepository);
  });

  it("should create folio successfully", async () => {
    const mockReserva = { id: "reserva-1" };
    const mockFolio = createMockFolio({ reservaId: "reserva-1" });

    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockFolioRepository.create = async () => mockFolio;

    const result = await useCase.execute({
      reservaId: "reserva-1",
    });

    expect(result).toBeDefined();
    expect(result.reservaId).toBe("reserva-1");
  });

  it("should create folio with promociones", async () => {
    const mockReserva = { id: "reserva-1" };
    const mockPromo1 = new Promocion("promo-1", "PROMO-VERANO", "PORCENTAJE", 15, new Date("2025-01-01T00:00:00Z"), new Date("2027-12-31T23:59:59Z"), true, new Date(), new Date());
    const mockPromo2 = new Promocion("promo-2", "PROMO-INVIERNO", "MONTO_FIJO", 500, new Date("2025-01-01T00:00:00Z"), new Date("2027-12-31T23:59:59Z"), true, new Date(), new Date());
    const mockFolio = createMockFolioWithPromociones({
      reservaId: "reserva-1",
    });

    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockPromocionRepository.findById = async (id: string) => {
      if (id === "promo-1") return mockPromo1 as any;
      if (id === "promo-2") return mockPromo2 as any;
      return null;
    };
    mockFolioRepository.create = async () => mockFolio;

    const result = await useCase.execute({
      reservaId: "reserva-1",
      promocionIds: ["promo-1", "promo-2"],
    });

    expect(result.promociones).toHaveLength(2);
    expect(result.promociones[0].codigo).toBe("PROMO-VERANO");
    expect(result.promociones[1].codigo).toBe("PROMO-INVIERNO");
  });

  it("should throw error when reserva not found", async () => {
    mockReservaRepository.findById = async () => null;

    await expect(
      useCase.execute({
        reservaId: "non-existent-reserva",
      }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when promocion not found", async () => {
    const mockReserva = { id: "reserva-1" };
    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockPromocionRepository.findById = async () => null;

    await expect(
      useCase.execute({
        reservaId: "reserva-1",
        promocionIds: ["non-existent-promo"],
      }),
    ).rejects.toThrow(FolioException);
  });

  it("should throw error when promocion is inactive", async () => {
    const mockReserva = { id: "reserva-1" };
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

    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockPromocionRepository.findById = async () => inactivePromo as any;

    await expect(
      useCase.execute({
        reservaId: "reserva-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionInactive());
  });

  it("should throw error when promocion is expired", async () => {
    const mockReserva = { id: "reserva-1" };
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

    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockPromocionRepository.findById = async () => expiredPromo as any;

    await expect(
      useCase.execute({
        reservaId: "reserva-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionExpired());
  });

  it("should throw error when promocion is not yet available", async () => {
    const mockReserva = { id: "reserva-1" };
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

    mockReservaRepository.findById = async () => mockReserva as unknown as Reserva;
    mockPromocionRepository.findById = async () => futurePromo as any;

    await expect(
      useCase.execute({
        reservaId: "reserva-1",
        promocionIds: ["promo-1"],
      }),
    ).rejects.toThrow(FolioException.promocionNotYetAvailable());
  });
});