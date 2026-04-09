import { vi } from "vitest";
import { IHabitacionRepository } from "../../src/domain/interfaces/habitacion.repository.interface";

export function createMockHabitacionRepository(): IHabitacionRepository {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdWithMuebles: vi.fn(),
    findByNumero: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
    hasRelatedRecords: vi.fn(),
    findAllWithDirectPrice: vi.fn(),
    findByTipoWithDirectPrice: vi.fn(),
    findAvailableInDateRange: vi.fn(),
    findByIdWithDirectPrice: vi.fn(),
    findByIdWithDirectPriceAndMuebles: vi.fn(),
    findByIdWithReservas: vi.fn(),
    findByIdWithReservasAndMuebles: vi.fn(),
    findAllPaginated: vi.fn(),
  } as any;
}
