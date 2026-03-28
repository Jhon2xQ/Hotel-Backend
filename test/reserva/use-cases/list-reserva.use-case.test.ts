import { describe, it, expect, beforeEach } from "vitest";
import { ListReservaUseCase } from "../../../src/application/use-cases/reserva/list-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { toReservaDto } from "../../../src/application/dtos/reserva.dto";

describe("ListReservaUseCase", () => {
  let useCase: ListReservaUseCase;
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
    expect(result).toEqual(mockReservas.map((r) => toReservaDto(r)));
  });
});
