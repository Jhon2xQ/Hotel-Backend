import { describe, it, expect, beforeEach, vi } from "vitest";
import { registerDependencies, resetContainer } from "../../src/common/IoC/container";
import { createHabitacionRoutes } from "../../src/routes/habitacion.routes";
import { createMockPrismaClient } from "../helpers/mock-prisma";

describe("Habitacion Routes Integration", () => {
  let mockPrisma: any;

  beforeEach(() => {
    resetContainer();
    mockPrisma = createMockPrismaClient();
    mockPrisma.habitacion = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };
    mockPrisma.tipoHabitacion = {
      findUnique: vi.fn(),
    };
    mockPrisma.catalogoMueble = {
      findUnique: vi.fn(),
    };
    registerDependencies(mockPrisma);
  });

  it("should have routes defined", () => {
    const routes = createHabitacionRoutes();
    expect(routes).toBeDefined();
  });

  it("should create habitacion route handler", async () => {
    const mockHabitacion = {
      id: "test-id",
      nroHabitacion: "301",
      tipoHabitacionId: "tipo-id",
      piso: 3,
      feature: null,
      amenities: null,
      urlImagen: null,
      estado: false,
      descripcion: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tipo: {
        id: "tipo-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    mockPrisma.tipoHabitacion.findUnique.mockResolvedValue({
      id: "tipo-id",
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockPrisma.habitacion.findUnique.mockResolvedValue(null);
    mockPrisma.habitacion.create.mockResolvedValue(mockHabitacion);

    const routes = createHabitacionRoutes();
    expect(routes).toBeDefined();
  });
});
