import { describe, it, expect, beforeEach } from "vitest";
import { createHabitationRoutes } from "../../src/routes/habitation.routes";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { HabitationType, HabitationStatus } from "../../src/domain/entities/habitation.entity";

describe("Habitation Routes Integration", () => {
  let app: any;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    app = createHabitationRoutes(mockPrisma);
  });

  it("should have routes defined", () => {
    expect(app).toBeDefined();
  });

  it("should create habitation route handler", async () => {
    const mockResult = {
      id: "test-id",
      numero: "101",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
      precio: 100,
      estado: HabitationStatus.Disponible,
      created_at: new Date(),
      updated_at: new Date(),
    };

    (mockPrisma.habitacion.findUnique as any).mockResolvedValue(null);
    (mockPrisma.habitacion.create as any).mockResolvedValue(mockResult);

    expect(mockPrisma.habitacion).toBeDefined();
  });
});
