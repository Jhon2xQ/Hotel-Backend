import { describe, it, expect, beforeEach, vi } from "vitest";
import { ListReservaPaginatedUseCase } from "../../../src/application/use-cases/reserva/list-reserva-paginated.use-case";
import type { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { createMockReserva } from "../../helpers/reserva-fixtures";

describe("ListReservaPaginatedUseCase", () => {
  let useCase: ListReservaPaginatedUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findAllPaginated: vi.fn(),
      findById: vi.fn(),
      findByCodigo: vi.fn(),
      findConflictingReservations: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      cancel: vi.fn(),
    } as unknown as IReservaRepository;

    useCase = new ListReservaPaginatedUseCase(mockRepository);
  });

  it("debe retornar resultado paginado sin filtros", async () => {
    const mockReservas = [createMockReserva({ id: "res-1" })];

    mockRepository.findAllPaginated = vi.fn().mockResolvedValue({
      list: mockReservas,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.list).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it("debe pasar el filtro nombre al repositorio", async () => {
    mockRepository.findAllPaginated = vi.fn().mockResolvedValue({
      list: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    });

    await useCase.execute({ page: 1, limit: 10, nombre: "Juan" });

    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      nombre: "Juan",
    });
  });

  it("debe pasar el filtro tipo al repositorio", async () => {
    mockRepository.findAllPaginated = vi.fn().mockResolvedValue({
      list: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    });

    await useCase.execute({ page: 1, limit: 10, tipo: "Suite" });

    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      tipo: "Suite",
    });
  });

  it("debe pasar ambos filtros juntos", async () => {
    mockRepository.findAllPaginated = vi.fn().mockResolvedValue({
      list: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    });

    await useCase.execute({ page: 2, limit: 5, nombre: "García", tipo: "Doble" });

    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      nombre: "García",
      tipo: "Doble",
    });
  });
});
