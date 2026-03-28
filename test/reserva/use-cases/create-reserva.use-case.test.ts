import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateReservaUseCase } from "../../../src/application/use-cases/reserva/create-reserva.use-case";
import type { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import type { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import type { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import type { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
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

  beforeEach(() => {
    const full = createMockReserva();

    mockRepository = {
      create: async () => full,
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => full,
      delete: async () => {},
      cancel: async () => full,
    } as unknown as IReservaRepository;

    mockHuespedRepository = {
      findById: async () => full.huesped,
    } as unknown as IHuespedRepository;

    mockHabitacionRepository = {
      findById: async () => full.habitacion,
    } as unknown as IHabitacionRepository;

    mockTarifaRepository = {
      findById: async () => full.tarifa,
    } as unknown as ITarifaRepository;

    useCase = new CreateReservaUseCase(
      mockRepository,
      mockHuespedRepository,
      mockHabitacionRepository,
      mockTarifaRepository,
    );
  });

  it("debe crear una reserva exitosamente con código generado automáticamente", async () => {
    const input: CreateReservaDto = {
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaEntrada: new Date("2024-03-25T14:00:00.000Z"),
      fechaSalida: new Date("2024-03-27T12:00:00.000Z"),
      adultos: 2,
      ninos: 1,
      montoDescuento: 0,
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
      fechaEntrada: new Date("2024-03-27T14:00:00.000Z"),
      fechaSalida: new Date("2024-03-25T12:00:00.000Z"),
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
      fechaEntrada: new Date("2024-03-25T14:00:00.000Z"),
      fechaSalida: new Date("2024-03-27T12:00:00.000Z"),
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
      fechaEntrada: new Date("2024-03-25T14:00:00.000Z"),
      fechaSalida: new Date("2024-03-27T12:00:00.000Z"),
      adultos: 2,
      ninos: -1,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });
});
