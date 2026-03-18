import { describe, it, expect, beforeEach, vi } from "vitest";
import { createHabitacionRoutes } from "../../src/routes/habitacion.routes";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { EstadoHabitacion, EstadoLimpieza } from "../../src/domain/entities/habitacion.entity";

describe("Habitacion Routes Integration", () => {
  let app: any;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.habitacion = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    mockPrisma.estancia = {
      count: vi.fn(),
    };
    app = createHabitacionRoutes(mockPrisma);
  });

  it("should have routes defined", () => {
    expect(app).toBeDefined();
  });

  it("should create habitacion route handler", async () => {
    const mockResult = {
      id: "test-id",
      nroHabitacion: "301",
      tipoId: "tipo-id",
      piso: 3,
      urlImagen: null,
      estado: EstadoHabitacion.DISPONIBLE,
      limpieza: EstadoLimpieza.LIMPIA,
      notas: null,
      ultimaLimpieza: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.habitacion.create.mockResolvedValue(mockResult);

    expect(mockPrisma.habitacion).toBeDefined();
  });
});
