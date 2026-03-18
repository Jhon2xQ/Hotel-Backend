import { describe, it, expect, beforeEach, vi } from "vitest";
import { FurnitureCatalogRepository } from "../../src/infrastructure/repositories/furniture-catalog.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { FurnitureCategory } from "../../src/domain/entities/furniture-catalog.entity";
import { FurnitureCatalogException } from "../../src/domain/exceptions/furniture-catalog.exception";
import { Prisma } from "../../generated/prisma/client";

describe("FurnitureCatalogRepository", () => {
  let repository: FurnitureCatalogRepository;
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
    repository = new FurnitureCatalogRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a furniture catalog", async () => {
      const input = {
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: FurnitureCategory.Cama,
        descripcion: "Cama king size con colchón ortopédico",
      };

      const mockResult = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: "CAMA",
        descripcion: "Cama king size con colchón ortopédico",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.catalogoMueble.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.codigo).toBe("CAMA-KING-01");
      expect(result.nombre).toBe("Cama King Size");
      expect(mockPrisma.catalogoMueble.create).toHaveBeenCalled();
    });

    it("should throw exception on duplicate codigo", async () => {
      const input = {
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: FurnitureCategory.Cama,
      };

      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      });

      mockPrisma.catalogoMueble.create.mockRejectedValue(error);

      await expect(repository.create(input)).rejects.toThrow(FurnitureCatalogException);
    });
  });

  describe("findAll", () => {
    it("should return all furniture catalogs", async () => {
      const mockResults = [
        {
          id: "id-1",
          codigo: "CAMA-KING-01",
          nombre: "Cama King Size",
          categoria: "CAMA",
          descripcion: "Descripción 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "id-2",
          codigo: "TV-55-01",
          nombre: "TV 55 pulgadas",
          categoria: "TECNOLOGIA",
          descripcion: "Descripción 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.catalogoMueble.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].codigo).toBe("CAMA-KING-01");
      expect(mockPrisma.catalogoMueble.findMany).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should find furniture catalog by id", async () => {
      const mockResult = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: "CAMA",
        descripcion: "Descripción",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.catalogoMueble.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.catalogoMueble.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.catalogoMueble.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByCodigo", () => {
    it("should find furniture catalog by codigo", async () => {
      const mockResult = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: "CAMA",
        descripcion: "Descripción",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.catalogoMueble.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findByCodigo("CAMA-KING-01");

      expect(result).not.toBeNull();
      expect(result?.codigo).toBe("CAMA-KING-01");
      expect(mockPrisma.catalogoMueble.findUnique).toHaveBeenCalledWith({
        where: { codigo: "CAMA-KING-01" },
      });
    });
  });

  describe("update", () => {
    it("should update furniture catalog", async () => {
      const updateData = {
        nombre: "Cama King Size Premium",
        descripcion: "Descripción actualizada",
      };

      const mockResult = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size Premium",
        categoria: "CAMA",
        descripcion: "Descripción actualizada",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.catalogoMueble.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-id", updateData);

      expect(result.nombre).toBe("Cama King Size Premium");
      expect(mockPrisma.catalogoMueble.update).toHaveBeenCalled();
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.catalogoMueble.update.mockRejectedValue(error);

      await expect(repository.update("non-existent-id", { nombre: "Test" })).rejects.toThrow(FurnitureCatalogException);
    });
  });

  describe("delete", () => {
    it("should delete furniture catalog", async () => {
      mockPrisma.catalogoMueble.delete.mockResolvedValue({});

      await repository.delete("test-id");

      expect(mockPrisma.catalogoMueble.delete).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.catalogoMueble.delete.mockRejectedValue(error);

      await expect(repository.delete("non-existent-id")).rejects.toThrow(FurnitureCatalogException);
    });
  });
});
