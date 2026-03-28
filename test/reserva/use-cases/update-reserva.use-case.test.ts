import { describe, it, expect, beforeEach } from "vitest";
import { UpdateReservaUseCase } from "../../../src/application/use-cases/reserva/update-reserva.use-case";
import type { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { EstadoReserva } from "../../../src/domain/entities/reserva.entity";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import type { UpdateReservaDto } from "../../../src/application/dtos/reserva.dto";

describe("UpdateReservaUseCase", () => {
  let useCase: UpdateReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockReserva(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockReserva(),
      delete: async () => {},
      cancel: async () => createMockReserva(),
    } as unknown as IReservaRepository;

    useCase = new UpdateReservaUseCase(mockRepository);
  });

  it("debe actualizar una reserva exitosamente", async () => {
    const input: UpdateReservaDto = {
      adultos: 3,
      ninos: 2,
      estado: EstadoReserva.CONFIRMADA,
    };

    const mockReserva = createMockReserva({
      adultos: 3,
      ninos: 2,
      estado: EstadoReserva.CONFIRMADA,
    });
    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.TENTATIVA });
    mockRepository.update = async () => mockReserva;

    const result = await useCase.execute("reserva-test-id", input);

    expect(result.adultos).toBe(3);
    expect(result.ninos).toBe(2);
    expect(result.estado).toBe(EstadoReserva.CONFIRMADA);
  });

  it("debe lanzar error si el repositorio no encuentra la reserva al actualizar", async () => {
    const input: UpdateReservaDto = {
      estado: EstadoReserva.CONFIRMADA,
    };

    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.TENTATIVA });
    mockRepository.update = async () => null;

    await expect(useCase.execute("non-existent-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error al intentar modificar reserva completada", async () => {
    const input: UpdateReservaDto = {
      adultos: 3,
    };

    mockRepository.findById = async () => createMockReserva({ estado: EstadoReserva.COMPLETADA });

    await expect(useCase.execute("reserva-test-id", input)).rejects.toThrow(ReservaException);
  });
});
