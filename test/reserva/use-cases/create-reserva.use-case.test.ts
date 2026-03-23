import { describe, it, expect, beforeEach } from "vitest";
import { CreateReservaUseCase } from "../../../src/application/use-cases/reserva/create-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { CreateReservaInput } from "../../../src/application/dtos/reserva.dto";

describe("CreateReservaUseCase", () => {
  let useCase: CreateReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async (_data: any) => createMockReserva(),
      findAll: async () => [],
      findById: async (_id: string) => null,
      findByCodigo: async (_codigo: string) => null,
      update: async (_id: string, _data: any) => createMockReserva(),
      delete: async (_id: string) => {},
      cancel: async (_id: string, _motivo: string) => createMockReserva(),
    } as any;

    useCase = new CreateReservaUseCase(mockRepository);
  });

  it("debe crear una reserva exitosamente", async () => {
    const input: CreateReservaInput = {
      codigo: "RES-2024-001",
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
    mockRepository.create = async (data) => mockReserva;

    const result = await useCase.execute(input);

    expect(result).toBe(mockReserva);
  });

  it("debe propagar errores del repositorio", async () => {
    const input: CreateReservaInput = {
      codigo: "RES-2024-001",
      huespedId: "huesped-id",
      habitacionId: "habitacion-id",
      tarifaId: "tarifa-id",
      fechaEntrada: new Date("2024-03-25T14:00:00.000Z"),
      fechaSalida: new Date("2024-03-27T12:00:00.000Z"),
      adultos: 2,
      ninos: 1,
    };

    mockRepository.create = async () => {
      throw ReservaException.duplicateCodigo("RES-2024-001");
    };

    await expect(useCase.execute(input)).rejects.toThrow(ReservaException);
  });
});
