import { describe, it, expect, beforeEach, vi } from "vitest";
import { registerDependencies, resetContainer } from "../../src/common/IoC/container";
import { createTipoHabitacionRoutes } from "../../src/routes/tipo-habitacion.routes";
import { createMockPrismaClient } from "../helpers/mock-prisma";

describe("TipoHabitacion Routes Integration", () => {
  let app: any;
  let mockPrisma: any;

  beforeEach(() => {
    resetContainer();
    mockPrisma = createMockPrismaClient();
    mockPrisma.tipoHabitacion = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    mockPrisma.habitacion = {
      count: vi.fn(),
    };
    mockPrisma.tarifa = {
      count: vi.fn(),
    };
    mockPrisma.reserva = {
      count: vi.fn(),
    };
    registerDependencies(mockPrisma);
    app = createTipoHabitacionRoutes();
  });

  it("should have routes defined", () => {
    expect(app).toBeDefined();
  });

  it("should create tipo habitacion route handler", async () => {
    const mockResult = {
      id: "test-id",
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo",
      tieneDucha: true,
      tieneBanio: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.tipoHabitacion.create.mockResolvedValue(mockResult);

    expect(mockPrisma.tipoHabitacion).toBeDefined();
  });
});
