import { describe, it, expect, beforeEach } from "vitest";
import { CreateFolioUseCase } from "../../../src/application/use-cases/folio/create-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("CreateFolioUseCase", () => {
  let useCase: CreateFolioUseCase;
  let mockFolioRepository: IFolioRepository;
  let mockReservaRepository: IReservaRepository;
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

    mockReservaRepository = {
      create: async () => ({ id: "reserva-1" } as any),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByCodigo: async () => null,
      findConflictingReservations: async () => [],
      update: async () => ({ id: "reserva-1" } as any),
      delete: async () => {},
      cancel: async () => ({ id: "reserva-1" } as any),
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
    const mockReserva = { id: "reserva-1", codigo: "RES-001" };
    const mockFolio = createMockFolio({ reservaId: "reserva-1", nroFolio: 1 });

    mockReservaRepository.findById = async () => mockReserva as any;
    mockFolioRepository.create = async () => mockFolio;

    const result = await useCase.execute({
      reservaId: "reserva-1",
    });

    expect(result).toBeDefined();
    expect(result.reserva_id).toBe("reserva-1");
  });

  it("should create folio with promociones", async () => {
    const mockReserva = { id: "reserva-1", codigo: "RES-001" };
    const mockPromo1 = { id: "promo-1", codigo: "PROMO-VERANO" };
    const mockPromo2 = { id: "promo-2", codigo: "PROMO-INVIERNO" };
    const mockFolio = createMockFolio({
      reservaId: "reserva-1",
      promociones: ["PROMO-VERANO", "PROMO-INVIERNO"],
    });

    mockReservaRepository.findById = async () => mockReserva as any;
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

    expect(result.promociones).toEqual(["PROMO-VERANO", "PROMO-INVIERNO"]);
  });

  it("should throw error when reserva not found", async () => {
    mockReservaRepository.findById = async () => null;

    await expect(
      useCase.execute({
        reservaId: "non-existent-reserva",
      }),
    ).rejects.toThrow(ReservaException);
  });

  it("should throw error when promocion not found", async () => {
    const mockReserva = { id: "reserva-1", codigo: "RES-001" };
    mockReservaRepository.findById = async () => mockReserva as any;
    mockPromocionRepository.findById = async () => null;

    await expect(
      useCase.execute({
        reservaId: "reserva-1",
        promocionIds: ["non-existent-promo"],
      }),
    ).rejects.toThrow(FolioException);
  });
});