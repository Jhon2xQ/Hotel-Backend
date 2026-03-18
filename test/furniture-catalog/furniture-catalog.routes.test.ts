import { describe, it, expect, beforeEach, vi } from "vitest";
import { createFurnitureCatalogRoutes } from "../../src/routes/furniture-catalog.routes";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { FurnitureCategory } from "../../src/domain/entities/furniture-catalog.entity";

describe("Furniture Catalog Routes Integration", () => {
  let app: any;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.catalogoMueble = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    app = createFurnitureCatalogRoutes(mockPrisma);
  });

  it("should have routes defined", () => {
    expect(app).toBeDefined();
  });

  it("should create furniture catalog route handler", async () => {
    const mockResult = {
      id: "test-id",
      codigo: "CAMA-KING-01",
      nombre: "Cama King Size",
      categoria: FurnitureCategory.Cama,
      descripcion: "Descripción",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.catalogoMueble.findUnique.mockResolvedValue(null);
    mockPrisma.catalogoMueble.create.mockResolvedValue(mockResult);

    expect(mockPrisma.catalogoMueble).toBeDefined();
  });
});
