import { vi } from "vitest";
import { IHabitacionRepository } from "../../src/domain/interfaces/habitacion.repository.interface";

export function createMockHabitacionRepository(): IHabitacionRepository {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByNumero: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
    hasRelatedRecords: vi.fn(),
    findAvailableWithFilters: vi.fn(),
  } as any;
}
