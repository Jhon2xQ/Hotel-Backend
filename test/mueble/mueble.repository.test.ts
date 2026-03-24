import { describe, it, expect, vi, beforeEach } from "vitest";
import { MuebleRepository } from "../../src/infrastructure/repositories/mueble.repository";
import { PrismaClient } from "../../generated/prisma/client";
import { MuebleCondition } from "../../src/domain/entities/mueble.entity";

describe("MuebleRepository", () => {
  let repository: MuebleRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      mueble: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    repository = new MuebleRepository(mockPrisma as unknown as PrismaClient);
  });

  describe("create", () => {
    it("should create a mueble", async () => {
      const mockData = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        descripcion: null,
        categoriaId: "categoria-id",
        imagenUrl: null,
        condicion: "BUENO",
        fechaAdq: null,
        ultimaRevision: null,
        habitacionId: "habitacion-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.mueble.create.mockResolvedValue(mockData);

      const result = await repository.create({
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        categoriaId: "categoria-id",
        condicion: MuebleCondition.Bueno,
        habitacionId: "habitacion-id",
      });

      expect(result).toBeDefined();
      expect(result.codigo).toBe("CAMA-001");
      expect(mockPrisma.mueble.create).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all muebles", async () => {
      const mockData = [
        {
          id: "id-1",
          codigo: "CAMA-001",
          nombre: "Cama King Size",
          descripcion: null,
          categoriaId: "categoria-id",
          imagenUrl: null,
          condicion: "BUENO",
          fechaAdq: null,
          ultimaRevision: null,
          habitacionId: "habitacion-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.mueble.findMany.mockResolvedValue(mockData);

      const results = await repository.findAll();

      expect(results).toHaveLength(1);
      expect(results[0].codigo).toBe("CAMA-001");
      expect(mockPrisma.mueble.findMany).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return mueble when found", async () => {
      const mockData = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        descripcion: null,
        categoriaId: "categoria-id",
        imagenUrl: null,
        condicion: "BUENO",
        fechaAdq: null,
        ultimaRevision: null,
        habitacionId: "habitacion-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.mueble.findUnique.mockResolvedValue(mockData);

      const result = await repository.findById("test-id");

      expect(result).toBeDefined();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.mueble.findUnique).toHaveBeenCalledWith({ where: { id: "test-id" } });
    });

    it("should return null when not found", async () => {
      mockPrisma.mueble.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findByCodigo", () => {
    it("should return mueble when found by codigo", async () => {
      const mockData = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        descripcion: null,
        categoriaId: "categoria-id",
        imagenUrl: null,
        condicion: "BUENO",
        fechaAdq: null,
        ultimaRevision: null,
        habitacionId: "habitacion-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.mueble.findUnique.mockResolvedValue(mockData);

      const result = await repository.findByCodigo("CAMA-001");

      expect(result).toBeDefined();
      expect(result?.codigo).toBe("CAMA-001");
    });

    it("should return null when not found", async () => {
      mockPrisma.mueble.findUnique.mockResolvedValue(null);

      const result = await repository.findByCodigo("NON-EXISTENT");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update mueble", async () => {
      const mockData = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama Queen Size",
        descripcion: null,
        categoriaId: "categoria-id",
        imagenUrl: null,
        condicion: "REGULAR",
        fechaAdq: null,
        ultimaRevision: null,
        habitacionId: "habitacion-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.mueble.update.mockResolvedValue(mockData);

      const result = await repository.update("test-id", {
        nombre: "Cama Queen Size",
        condicion: MuebleCondition.Regular,
      });

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Cama Queen Size");
      expect(mockPrisma.mueble.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete mueble", async () => {
      mockPrisma.mueble.delete.mockResolvedValue({});

      await repository.delete("test-id");

      expect(mockPrisma.mueble.delete).toHaveBeenCalledWith({ where: { id: "test-id" } });
    });
  });
});
