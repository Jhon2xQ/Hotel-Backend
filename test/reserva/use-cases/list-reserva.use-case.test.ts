import { describe, it, expect, beforeEach } from "vitest";
import { ListReservaUseCase } from "../../../src/application/use-cases/reserva/list-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { createMockReserva } from "../../helpers/reserva-fixtures";

describe("ListReservaUseCase", () => {
  let useCase: ListReservaUseCase;
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

    useCase = new ListReservaUseCase(mockRepository);
  });

  it("debe retornar una lista vacía cuando no hay reservas", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("debe retornar todas las reservas", async () => {
    const mockReservas = [
      createMockReserva({ id: "1", codigo: "RES-001" }),
      createMockReserva({ id: "2", codigo: "RES-002" }),
    ];
    mockRepository.findAll = async () => mockReservas;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(mockReservas);
  });
});
