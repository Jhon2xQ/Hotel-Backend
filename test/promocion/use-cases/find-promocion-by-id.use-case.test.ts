import { describe, it, expect, beforeEach } from "vitest";
import { FindPromocionByIdUseCase } from "../../../src/application/use-cases/promocion/find-promocion-by-id.use-case";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { PromocionException } from "../../../src/domain/exceptions/promocion.exception";
import { createMockPromocionWithHabitaciones } from "../../helpers/promocion-fixtures";

describe("FindPromocionByIdUseCase", () => {
  let useCase: FindPromocionByIdUseCase;
  let mockRepository: IPromocionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPromocionWithHabitaciones(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockPromocionWithHabitaciones(),
      delete: async () => {},
    };

    useCase = new FindPromocionByIdUseCase(mockRepository);
  });

  it("should find promocion by id successfully", async () => {
    const mockPromocion = createMockPromocionWithHabitaciones({
      id: "promo-123",
      codigo: "PROMO-VERANO",
      habitaciones: ["hab-1", "hab-2"],
    });

    mockRepository.findById = async (id: string) => {
      if (id === "promo-123") return mockPromocion;
      return null;
    };

    const result = await useCase.execute("promo-123");

    expect(result).toBeDefined();
    expect(result.id).toBe("promo-123");
    expect(result.codigo).toBe("PROMO-VERANO");
    expect(result.habitaciones).toEqual(["hab-1", "hab-2"]);
  });

  it("should throw error when promocion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(PromocionException);
  });
});
