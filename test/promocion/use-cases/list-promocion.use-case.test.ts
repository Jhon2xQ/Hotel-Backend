import { describe, it, expect, beforeEach } from "vitest";
import { ListPromocionUseCase } from "../../../src/application/use-cases/promocion/list-promocion.use-case";
import { IPromocionRepository } from "../../../src/domain/interfaces/promocion.repository.interface";
import { createMockPromocionWithHabitaciones } from "../../helpers/promocion-fixtures";

describe("ListPromocionUseCase", () => {
  let useCase: ListPromocionUseCase;
  let mockRepository: IPromocionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPromocionWithHabitaciones(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      findByCodigos: async () => [],
      findByIds: async () => [],
      update: async () => createMockPromocionWithHabitaciones(),
      delete: async () => {},
    };

    useCase = new ListPromocionUseCase(mockRepository);
  });

  it("should return empty array when no promociones exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toBeDefined();
    expect(result).toEqual([]);
  });

  it("should return array with promociones", async () => {
    const promociones = [
      createMockPromocionWithHabitaciones({ id: "promo-1", codigo: "PROMO-1" }),
      createMockPromocionWithHabitaciones({ id: "promo-2", codigo: "PROMO-2" }),
      createMockPromocionWithHabitaciones({ id: "promo-3", codigo: "PROMO-3" }),
    ];

    mockRepository.findAll = async () => promociones;

    const result = await useCase.execute();

    expect(result.length).toBe(3);
    expect(result[0].codigo).toBe("PROMO-1");
  });

  it("should include habitaciones in each promocion", async () => {
    const promociones = [
      createMockPromocionWithHabitaciones({ id: "promo-1", codigo: "PROMO-1", habitaciones: ["hab-1", "hab-2"] }),
      createMockPromocionWithHabitaciones({ id: "promo-2", codigo: "PROMO-2", habitaciones: [] }),
    ];

    mockRepository.findAll = async () => promociones;

    const result = await useCase.execute();

    expect(result[0].habitaciones).toEqual(["hab-1", "hab-2"]);
    expect(result[1].habitaciones).toEqual([]);
  });
});
