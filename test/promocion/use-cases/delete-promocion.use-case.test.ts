import { describe, it, expect, beforeEach } from "vitest";
import { DeletePromocionUseCase } from "../../../src/application/use-cases/promocion/delete-promocion.use-case";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { PromocionException } from "../../../src/domain/exceptions/promocion.exception";
import { createMockPromocionWithHabitaciones } from "../../helpers/promocion-fixtures";

describe("DeletePromocionUseCase", () => {
  let useCase: DeletePromocionUseCase;
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

    useCase = new DeletePromocionUseCase(mockRepository);
  });

  it("should delete promocion successfully", async () => {
    const existingPromocion = createMockPromocionWithHabitaciones({ id: "promo-to-delete" });

    mockRepository.findById = async (id: string) => {
      if (id === "promo-to-delete") return existingPromocion;
      return null;
    };

    let deleteCalled = false;
    mockRepository.delete = async () => {
      deleteCalled = true;
    };

    await useCase.execute("promo-to-delete");

    expect(deleteCalled).toBe(true);
  });

  it("should throw error when promocion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(PromocionException);
  });
});
