import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateReservaUseCase } from "../../../src/application/use-cases/reserva/create-reserva.use-case";
import type { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import type { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import type { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import type { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import type { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { createMockHuesped } from "../../helpers/huesped-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";
import type { CreateReservaDto } from "../../../src/application/dtos/reserva.dto";

vi.mock("../../../src/common/utils/codigo-generator", () => ({
  generateCodigoReserva: vi.fn(() => "KOR-20260327-A7K9P2"),
}));

describe("CreateReservaUseCase", () => {
  let useCase: CreateReservaUseCase;
  let mockRepository: IReservaRepository;
  let mockHuespedRepository: IHuespedRepository;
  let mockHabitacionRepository: IHabitacionRepository;
  let mockTarifaRepository: ITarifaRepository;
  let mockPromocionRepository: IPromocionRepository;

  beforeEach(() => {
    const full = createMockReserva();
    const mockHuesped = createMockHuesped();
    const mockHabitacion = createMockHabitacion();
    const mockTarifa = createMockTarifa();

    mockRepository = {
      create: async () => full,
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findConflictingReservations: async () => [],
      update: async () => full,
      delete: async () => {},
      cancel: async () => full,
    } as unknown as IReservaRepository;

    mockHuespedRepository = {
      findById: async () => mockHuesped,
    } as unknown as IHuespedRepository;

    mockHabitacionRepository = {
      findById: async () => mockHabitacion,
    } as unknown as IHabitacionRepository;

    mockTarifaRepository = {
      findById: async () => mockTarifa,
    } as unknown as ITarifaRepository;

    mockPromocionRepository = {
      findByIds: async () => [],
    } as unknown as IPromocionRepository;

    useCase = new CreateReservaUseCase(
      mockRepository,
      mockHuespedRepository,
      mockHabitacionRepository,
      mockTarifaRepository,
      mockPromocionRepository,
    );
  });

  it("debe crear una reserva exitosamente con código generado automáticamente", async () => {
    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
    };

    const mockReserva = createMockReserva();
    mockRepository.create = vi.fn(async (data) => {
      expect(data.codigo).toBe("KOR-20260327-A7K9P2");
      return mockReserva;
    });

    const result = await useCase.execute(input);

    expect(result).toBe(mockReserva);
  });

  it("debe lanzar error si las fechas son inválidas", async () => {
    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-27"),
      fechaFin: new Date("2024-03-25"),
      adultos: 2,
      ninos: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error si adultos es menor a 1", async () => {
    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 0,
      ninos: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error si niños es negativo", async () => {
    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: -1,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error si hay conflicto de fechas con otra reserva", async () => {
    mockRepository.findConflictingReservations = async () => [createMockReserva()];

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });

  it("debe calcular correctamente la cantidad de unidades para noches (diferencia + 1)", async () => {
    const mockReserva = createMockReserva();
    let capturedData: any;

    mockRepository.create = vi.fn(async (data) => {
      capturedData = data;
      return mockReserva;
    });

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
    };

    await useCase.execute(input);

    // 27 - 25 = 2 días de diferencia + 1 = 3 noches
    expect(capturedData.cantidadUnidad).toBe(3);
  });

  it("debe aplicar descuento porcentual de promociones activas y vigentes", async () => {
    const mockPromo = {
      id: "promo-id",
      codigo: "PROMO-10",
      tipoDescuento: "PORCENTAJE",
      valorDescuento: 10,
      vigDesde: new Date("2020-01-01"),
      vigHasta: new Date("2030-12-31"),
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPromocionRepository.findByIds = async (ids: string[]) => [mockPromo];

    const mockReserva = createMockReserva();
    let capturedData: any;

    mockRepository.create = vi.fn(async (data) => {
      capturedData = data;
      return mockReserva;
    });

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
      promociones: ["promo-id"],
    };

    await useCase.execute(input);

    // precioTarifa: 150, unidades: 3, subtotal: 450
    // descuento: 450 * 10% = 45
    // montoConDescuento: 450 - 45 = 405
    // montoTotal: 405 * 1.18 = 477.9
    expect(capturedData.montoDescuento).toBe(45);
    expect(capturedData.promociones).toContain("PROMO-10");
  });

  it("debe aplicar descuento de monto fijo de promociones activas y vigentes", async () => {
    const mockPromo = {
      id: "promo-id",
      codigo: "PROMO-50",
      tipoDescuento: "MONTO_FIJO",
      valorDescuento: 50,
      vigDesde: new Date("2020-01-01"),
      vigHasta: new Date("2030-12-31"),
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPromocionRepository.findByIds = async (ids: string[]) => [mockPromo];

    const mockReserva = createMockReserva();
    let capturedData: any;

    mockRepository.create = vi.fn(async (data) => {
      capturedData = data;
      return mockReserva;
    });

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
      promociones: ["promo-id"],
    };

    await useCase.execute(input);

    // precioTarifa: 150, unidades: 3, subtotal: 450
    // descuento: 50
    // montoConDescuento: 450 - 50 = 400
    // montoTotal: 400 * 1.18 = 472
    expect(capturedData.montoDescuento).toBe(50);
    expect(capturedData.promociones).toContain("PROMO-50");
  });

  it("no debe aplicar promociones inactivas", async () => {
    const mockPromo = {
      id: "promo-id",
      codigo: "PROMO-INACTIVA",
      tipoDescuento: "PORCENTAJE",
      valorDescuento: 20,
      vigDesde: new Date("2020-01-01"),
      vigHasta: new Date("2030-12-31"),
      estado: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPromocionRepository.findByIds = async (ids: string[]) => [mockPromo];

    const mockReserva = createMockReserva();
    let capturedData: any;

    mockRepository.create = vi.fn(async (data) => {
      capturedData = data;
      return mockReserva;
    });

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
      promociones: ["promo-id"],
    };

    await useCase.execute(input);

    expect(capturedData.montoDescuento).toBe(0);
    expect(capturedData.promociones).toHaveLength(0);
  });

  it("no debe aplicar promociones vencidas", async () => {
    const mockPromo = {
      id: "promo-id",
      codigo: "PROMO-VENCIDA",
      tipoDescuento: "PORCENTAJE",
      valorDescuento: 20,
      vigDesde: new Date("2020-01-01"),
      vigHasta: new Date("2021-12-31"),
      estado: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPromocionRepository.findByIds = async (ids: string[]) => [mockPromo];

    const mockReserva = createMockReserva();
    let capturedData: any;

    mockRepository.create = vi.fn(async (data) => {
      capturedData = data;
      return mockReserva;
    });

    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaInicio: new Date("2024-03-25"),
      fechaFin: new Date("2024-03-27"),
      adultos: 2,
      ninos: 1,
      promociones: ["promo-id"],
    };

    await useCase.execute(input);

    expect(capturedData.montoDescuento).toBe(0);
    expect(capturedData.promociones).toHaveLength(0);
  });
});
