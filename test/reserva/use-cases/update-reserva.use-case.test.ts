import { describe, it, expect, beforeEach } from "vitest";
import { UpdateReservaUseCase } from "../../../src/application/use-cases/reserva/update-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { UpdateReservaInput } from "../../../src/application/dtos/reserva.dto";

describe("UpdateReservaUseCase", () => {
  let useCase: UpdateReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async (data) => createMockReserva(),
      findAll: async () => [],
      findById: async (id) => null,
      findByCodigo: async (codigo) => null,
      update: async (id, data) => createMockReserva(),
      delete: async (id) => {},
      cancel: async (id, motivo) => createMockReserva(),
    } as any;

    useCase = new UpdateReservaUseCase(mockRepository);
  });

  it("debe actualizar una reserva exitosamente", async () => {
    const input: UpdateReservaInput = {
      adultos: 3,
      ninos: 2,
      estado: "CONFIRMADA",
    };

    const mockReserva = createMockReserva({ adultos: 3, ninos: 2, estado: "CONFIRMADA" });
    mockRepository.update = async (id, data) => mockReserva;

    const result = await useCase.execute("reserva-test-id", input);

    expect(result.adultos).toBe(3);
    expect(result.ninos).toBe(2);
    expect(result.estado).toBe("CONFIRMADA");
  });

  it("debe propagar errores del repositorio", async () => {
    const input: UpdateReservaInput = {
      estado: "CONFIRMADA",
    };

    mockRepository.update = async () => {
      throw ReservaException.notFoundById();
    };

    await expect(useCase.execute("non-existent-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error al intentar modificar reserva completada", async () => {
    const input: UpdateReservaInput = {
      adultos: 3,
    };

    mockRepository.update = async () => {
      throw ReservaException.cannotModifyCompleted();
    };

    await expect(useCase.execute("reserva-test-id", input)).rejects.toThrow(ReservaException);
  });
});
