import { describe, it, expect, beforeEach } from "vitest";
import { HabitationRepository } from "../../src/infrastructure/repositories/habitation.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { HabitationType } from "../../src/domain/entities/habitation.entity";

describe("HabitationRepository", () => {
  let repository: HabitationRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    repository = new HabitationRepository(mockPrisma);
  });

  it("should create a habitation", async () => {
    const input = {
      numero: "101",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
      precio: 100,
    };

    const mockResult = {
      id: "test-id",
      numero: "101",
      piso: 1,
      tipo: "ESTÁNDAR SIMPLE",
      precio: 100,
      estado: "Disponible",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrisma.habitacion.create.mockResolvedValue(mockResult);

    const result = await repository.create(input);

    expect(result.numero).toBe("101");
    expect(mockPrisma.habitacion.create).toHaveBeenCalled();
  });
});
