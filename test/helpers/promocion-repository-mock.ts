import type { IPromocionRepository } from "../../src/domain/interfaces/promocion.repository.interface";
import { vi } from "vitest";

export function createMockPromocionRepository(): IPromocionRepository {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCodigo: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  } as unknown as IPromocionRepository;
}
