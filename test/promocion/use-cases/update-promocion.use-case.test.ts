import { describe, it, expect, beforeEach } from "vitest";
import { UpdatePromocionUseCase } from "../../../src/application/use-cases/promocion/update-promocion.use-case";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { PromocionException } from "../../../src/domain/exceptions/promocion.exception";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockPromocionWithHabitaciones } from "../../helpers/promocion-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("UpdatePromocionUseCase", () => {
  let useCase: UpdatePromocionUseCase;
  let mockRepository: IPromocionRepository;
  let mockHabitacionRepository: IHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPromocionWithHabitaciones(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findByCodigos: async () => [],
      findByIds: async () => [],
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

    useCase = new UpdatePromocionUseCase(mockRepository, mockHabitacionRepository);
  });

  it("should update promocion successfully", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({
      id: "promo-1",
      codigo: "PROMO-OLD",
    });

    const updatedPromocion = createMockPromocionWithHabitaciones({
      id: "promo-1",
      codigo: "PROMO-NEW",
      valorDescuento: 25.0,
    });

    mockRepository.findById = async () => existingPromocion;
    mockRepository.findByCodigo = async () => null;
    mockRepository.update = async () => updatedPromocion;

    const result = await useCase.execute("promo-1", {
      codigo: "PROMO-NEW",
      valor_descuento: 25.0,
    });

    expect(result).toBeDefined();
    expect(result.codigo).toBe("PROMO-NEW");
    expect(result.valor_descuento).toBe(25.0);
  });

  it("should update only estado field", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({
      id: "promo-2",
      estado: true,
    });

    const updatedPromocion = createMockPromocionWithHabitaciones({
      id: "promo-2",
      estado: false,
    });

    mockRepository.findById = async () => existingPromocion;
    mockRepository.update = async () => updatedPromocion;

    const result = await useCase.execute("promo-2", {
      estado: false,
    });

    expect(result.estado).toBe(false);
  });

  it("should update habitaciones and validate ids", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({ id: "promo-3" });
    const updatedPromocion = createMockPromocionWithHabitaciones({
      id: "promo-3",
      habitaciones: ["hab-1", "hab-2"],
    });

    mockRepository.findById = async () => existingPromocion;
    mockRepository.update = async () => updatedPromocion;
    mockHabitacionRepository.findById = async () => createMockHabitacion();

    const result = await useCase.execute("promo-3", {
      habitaciones: ["hab-1", "hab-2"],
    });

    expect(result.habitaciones).toEqual(["hab-1", "hab-2"]);
  });

  it("should throw error when promocion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        codigo: "PROMO-NEW",
      }),
    ).rejects.toThrow(PromocionException);
  });

  it("should throw error when updating to duplicate codigo", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({
      id: "promo-1",
      codigo: "PROMO-OLD",
    });

    const duplicatePromocion = createMockPromocionWithHabitaciones({
      id: "promo-2",
      codigo: "PROMO-DUPLICATE",
    });

    mockRepository.findById = async () => existingPromocion;
    mockRepository.findByCodigo = async (codigo: string) => {
      if (codigo === "PROMO-DUPLICATE") return duplicatePromocion;
      return null;
    };

    await expect(
      useCase.execute("promo-1", {
        codigo: "PROMO-DUPLICATE",
      }),
    ).rejects.toThrow(PromocionException);
  });

  it("should throw error when habitacion id does not exist", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({ id: "promo-1" });

    mockRepository.findById = async () => existingPromocion;
    mockHabitacionRepository.findById = async () => null;

    await expect(
      useCase.execute("promo-1", {
        habitaciones: ["non-existent-hab"],
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should allow keeping same codigo without duplicate check", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({
      id: "promo-1",
      codigo: "PROMO-SAME",
    });

    const updatedPromocion = createMockPromocionWithHabitaciones({
      id: "promo-1",
      codigo: "PROMO-SAME",
    });

    mockRepository.findById = async () => existingPromocion;
    mockRepository.update = async () => updatedPromocion;

    const result = await useCase.execute("promo-1", {
      codigo: "PROMO-SAME",
    });

    expect(result.codigo).toBe("PROMO-SAME");
  });
});
