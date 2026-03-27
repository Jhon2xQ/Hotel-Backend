import { describe, it, expect, beforeEach } from "vitest";
import { UpdateEstadoReservaUseCase } from "../../../src/application/use-cases/reserva/update-estado-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { UpdateEstadoReservaInput } from "../../../src/application/dtos/reserva.dto";

describe("UpdateEstadoReservaUseCase", () => {
  let useCase: UpdateEstadoReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async (_data: any) => createMockReserva(),
      findAll: async () => [],
      findById: async (_id: string) => createMockReserva(),
      findByCodigo: async (_codigo: string) => null,
      update: async (_id: string, _data: any) => createMockReserva({ estado: "CONFIRMADA" }),
      delete: async (_id: string) => {},
      cancel: async (_id: string, _motivo: string) => createMockReserva(),
    } as any;

    useCase = new UpdateEstadoReservaUseCase(mockRepository);
  });

  it("debe actualizar el estado de una reserva exitosamente", async () => {
    const input: UpdateEstadoReservaInput = {
      estado: "CONFIRMADA",
    };

    const mockReserva = createMockReserva({ estado: "CONFIRMADA" });
    mockRepository.update = async (_id, data) => {
      expect(data.estado).toBe("CONFIRMADA");
      return mockReserva;
    };

    const result = await useCase.execute("reserva-id", input);

    expect(result).toBe(mockReserva);
    expect(result.estado).toBe("CONFIRMADA");
  });

  it("debe lanzar error si la reserva no existe", async () => {
    mockRepository.findById = async (_id: string) => null;

    const input: UpdateEstadoReservaInput = {
      estado: "CONFIRMADA",
    };

    await expect(useCase.execute("reserva-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe permitir cambiar el estado incluso si la reserva está completada (admin)", async () => {
    mockRepository.findById = async (_id: string) => createMockReserva({ estado: "COMPLETADA" });

    const input: UpdateEstadoReservaInput = {
      estado: "EN_CASA",
    };

    const mockReserva = createMockReserva({ estado: "EN_CASA" });
    mockRepository.update = async (_id, _data) => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe("EN_CASA");
  });

  it("debe lanzar error si se intenta cambiar a CANCELADA", async () => {
    const input: UpdateEstadoReservaInput = {
      estado: "CANCELADA",
    };

    await expect(useCase.execute("reserva-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe permitir cambiar de TENTATIVA a EN_CASA", async () => {
    mockRepository.findById = async (_id: string) => createMockReserva({ estado: "TENTATIVA" });

    const input: UpdateEstadoReservaInput = {
      estado: "EN_CASA",
    };

    const mockReserva = createMockReserva({ estado: "EN_CASA" });
    mockRepository.update = async (_id, _data) => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe("EN_CASA");
  });

  it("debe permitir cambiar de EN_CASA a COMPLETADA", async () => {
    mockRepository.findById = async (_id: string) => createMockReserva({ estado: "EN_CASA" });

    const input: UpdateEstadoReservaInput = {
      estado: "COMPLETADA",
    };

    const mockReserva = createMockReserva({ estado: "COMPLETADA" });
    mockRepository.update = async (_id, _data) => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe("COMPLETADA");
  });
});
