import { describe, it, expect, beforeEach } from "vitest";
import { UpdateEstadoReservaUseCase } from "../../../src/application/use-cases/reserva/update-estado-reserva.use-case";
import type { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { EstadoReserva } from "../../../src/domain/entities/reserva.entity";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import type { UpdateEstadoReservaDto } from "../../../src/application/dtos/reserva.dto";

describe("UpdateEstadoReservaUseCase", () => {
  let useCase: UpdateEstadoReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockReserva(),
      findAll: async () => [],
      findById: async () => createMockReserva(),
      findByCodigo: async () => null,
      update: async () => createMockReserva({ estado: EstadoReserva.CONFIRMADA }),
      delete: async () => {},
      cancel: async () => createMockReserva(),
    } as unknown as IReservaRepository;

    useCase = new UpdateEstadoReservaUseCase(mockRepository);
  });

  it("debe actualizar el estado de una reserva exitosamente", async () => {
    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.CONFIRMADA,
    };

    const mockReserva = createMockReserva({ estado: EstadoReserva.CONFIRMADA });
    mockRepository.update = async (_id, data) => {
      expect(data.estado).toBe(EstadoReserva.CONFIRMADA);
      return mockReserva;
    };

    const result = await useCase.execute("reserva-id", input);

    expect(result).toBe(mockReserva);
    expect(result.estado).toBe(EstadoReserva.CONFIRMADA);
  });

  it("debe lanzar error si la reserva no existe", async () => {
    mockRepository.findById = async () => null;

    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.CONFIRMADA,
    };

    await expect(useCase.execute("reserva-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe permitir cambiar el estado incluso si la reserva está completada (admin)", async () => {
    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.COMPLETADA });

    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.EN_CASA,
    };

    const mockReserva = createMockReserva({ estado: EstadoReserva.EN_CASA });
    mockRepository.update = async () => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe(EstadoReserva.EN_CASA);
  });

  it("debe lanzar error si se intenta cambiar a CANCELADA", async () => {
    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.CANCELADA,
    };

    await expect(useCase.execute("reserva-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe permitir cambiar de TENTATIVA a EN_CASA", async () => {
    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.TENTATIVA });

    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.EN_CASA,
    };

    const mockReserva = createMockReserva({ estado: EstadoReserva.EN_CASA });
    mockRepository.update = async () => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe(EstadoReserva.EN_CASA);
  });

  it("debe permitir cambiar de EN_CASA a COMPLETADA", async () => {
    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.EN_CASA });

    const input: UpdateEstadoReservaDto = {
      estado: EstadoReserva.COMPLETADA,
    };

    const mockReserva = createMockReserva({ estado: EstadoReserva.COMPLETADA });
    mockRepository.update = async () => mockReserva;

    const result = await useCase.execute("reserva-id", input);

    expect(result.estado).toBe(EstadoReserva.COMPLETADA);
  });
});
