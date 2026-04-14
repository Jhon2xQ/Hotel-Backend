import { describe, it, expect, beforeEach } from "vitest";
import { CreatePromocionUseCase } from "../../../src/application/use-cases/promocion/create-promocion.use-case";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { PromocionException } from "../../../src/domain/exceptions/promocion.exception";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockPromocionWithHabitaciones } from "../../helpers/promocion-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("CreatePromocionUseCase", () => {
  let useCase: CreatePromocionUseCase;
  let mockRepository: IPromocionRepository;
  let mockHabitacionRepository: IHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPromocionWithHabitaciones(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockPromocionWithHabitaciones(),
      delete: async () => {},
    };

    mockHabitacionRepository = {
      create: async () => createMockHabitacion(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByIdWithMuebles: async () => null,
      findByIdWithReservas: async () => null,
      findByIdWithReservasAndMuebles: async () => null,
      findByNumero: async () => null,
      update: async () => createMockHabitacion(),
      updateStatus: async () => createMockHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findAllWithDirectPrice: async () => [],
      findByTipoWithDirectPrice: async () => [],
      findAvailableInDateRange: async () => [],
      findByIdWithDirectPrice: async () => null,
      findByIdWithDirectPriceAndMuebles: async () => null,
    };

    useCase = new CreatePromocionUseCase(mockRepository, mockHabitacionRepository);
  });

  it("should create promocion successfully", async () => {
    const mockPromocion = createMockPromocionWithHabitaciones({
      codigo: "PROMO-VERANO",
      tipoDescuento: "PORCENTAJE",
      valorDescuento: 15.0,
    });

    mockRepository.create = async () => mockPromocion;
    mockRepository.findByCodigo = async () => null;

    const result = await useCase.execute({
      codigo: "PROMO-VERANO",
      tipo_descuento: "PORCENTAJE",
      valor_descuento: 15.0,
      vig_desde: new Date("2026-06-01"),
      vig_hasta: new Date("2026-08-31"),
    });

    expect(result).toBeDefined();
    expect(result.codigo).toBe("PROMO-VERANO");
    expect(result.tipo_descuento).toBe("PORCENTAJE");
    expect(result.valor_descuento).toBe(15.0);
  });

  it("should create promocion with MONTO_FIJO discount type", async () => {
    const mockPromocion = createMockPromocionWithHabitaciones({
      codigo: "DESCUENTO-FIJO",
      tipoDescuento: "MONTO_FIJO",
      valorDescuento: 50.0,
    });

    mockRepository.create = async () => mockPromocion;
    mockRepository.findByCodigo = async () => null;

    const result = await useCase.execute({
      codigo: "DESCUENTO-FIJO",
      tipo_descuento: "MONTO_FIJO",
      valor_descuento: 50.0,
      vig_desde: new Date("2026-01-01"),
      vig_hasta: new Date("2026-12-31"),
    });

    expect(result.tipo_descuento).toBe("MONTO_FIJO");
    expect(result.valor_descuento).toBe(50.0);
  });

  it("should create promocion with habitaciones and validate ids", async () => {
    const habitacionIds = ["hab-1", "hab-2", "hab-3"];
    const mockPromocion = createMockPromocionWithHabitaciones({
      codigo: "PROMO-HAB",
      habitaciones: habitacionIds,
    });

    mockRepository.create = async () => mockPromocion;
    mockRepository.findByCodigo = async () => null;
    mockHabitacionRepository.findById = async () => createMockHabitacion();

    const result = await useCase.execute({
      codigo: "PROMO-HAB",
      tipo_descuento: "PORCENTAJE",
      valor_descuento: 10.0,
      vig_desde: new Date("2026-06-01"),
      vig_hasta: new Date("2026-06-30"),
      habitaciones: habitacionIds,
    });

    expect(result).toBeDefined();
    expect(result.codigo).toBe("PROMO-HAB");
    expect(result.habitaciones).toEqual(habitacionIds);
  });

  it("should throw error when codigo already exists", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({ codigo: "PROMO-DUPLICADA" });
    mockRepository.findByCodigo = async (codigo: string) => {
      if (codigo === "PROMO-DUPLICADA") return existingPromocion;
      return null;
    };

    await expect(
      useCase.execute({
        codigo: "PROMO-DUPLICADA",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 20.0,
        vig_desde: new Date("2026-06-01"),
        vig_hasta: new Date("2026-08-31"),
      }),
    ).rejects.toThrow(PromocionException);
  });

  it("should throw error when habitacion id does not exist", async () => {
    mockRepository.findByCodigo = async () => null;
    mockHabitacionRepository.findById = async () => null;

    await expect(
      useCase.execute({
        codigo: "PROMO-INVALID",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 10.0,
        vig_desde: new Date("2026-06-01"),
        vig_hasta: new Date("2026-06-30"),
        habitaciones: ["non-existent-hab"],
      }),
    ).rejects.toThrow(HabitacionException);
  });
});
