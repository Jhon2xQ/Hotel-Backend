import { describe, it, expect, beforeEach } from "vitest";
import { FindReservaByIdUseCase } from "../../../src/application/use-cases/reserva/find-reserva-by-id.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";

describe("FindReservaByIdUseCase", () => {
  let useCase: FindReservaByIdUseCase;
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

    useCase = new FindReservaByIdUseCase(mockRepository);
  });

  it("debe retornar una reserva cuando existe", async () => {
    const mockReserva = createMockReserva();
    mockRepository.findById = async (id) => mockReserva;

    const result = await useCase.execute("reserva-test-id");

    expect(result).toBe(mockReserva);
  });

  it("debe lanzar ReservaException cuando no existe", async () => {
    mockRepository.findById = async (id) => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(ReservaException);
  });
});
