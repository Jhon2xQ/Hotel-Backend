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
      create: async (_data: any) => createMockReserva(),
      findAll: async () => [],
      findById: async (_id: string) => null,
      findByCodigo: async (_codigo: string) => null,
      update: async (_id: string, _data: any) => createMockReserva(),
      delete: async (_id: string) => {},
      cancel: async (_id: string, _motivo: string) => createMockReserva(),
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
