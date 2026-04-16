import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductoRepository } from "../../src/infrastructure/repositories/producto.repository";
import { PrismaClient } from "../../generated/prisma/client";

describe("ProductoRepository", () => {
  let repository: ProductoRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      producto: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
    };

    repository = new ProductoRepository(mockPrisma as unknown as PrismaClient);
  });

  describe("create", () => {
    it("should create a producto", async () => {
      const mockData = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia de 355ml",
        precioUnitario: 5.5,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.producto.create.mockResolvedValue(mockData);

      const result = await repository.create({
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia de 355ml",
        precioUnitario: 5.5,
        stock: 100,
      });

      expect(result).toBeDefined();
      expect(result.codigo).toBe("PROD-001");
      expect(result.nombre).toBe("Cerveza Cristal");
      expect(mockPrisma.producto.create).toHaveBeenCalled();
    });

    it("should create producto with default stock", async () => {
      const mockData = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Agua Mineral",
        descripcion: null,
        precioUnitario: 2.0,
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.producto.create.mockResolvedValue(mockData);

      const result = await repository.create({
        codigo: "PROD-001",
        nombre: "Agua Mineral",
        precioUnitario: 2.0,
      });

      expect(result.stock).toBe(0);
    });
  });

  describe("findAll", () => {
    it("should return all productos", async () => {
      const mockData = [
        {
          id: "id-1",
          codigo: "PROD-001",
          nombre: "Cerveza Cristal",
          descripcion: "Cerveza rubia",
          precioUnitario: 5.5,
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.producto.findMany.mockResolvedValue(mockData);

      const results = await repository.findAll();

      expect(results).toHaveLength(1);
      expect(results[0].codigo).toBe("PROD-001");
      expect(mockPrisma.producto.findMany).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return producto when found", async () => {
      const mockData = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia",
        precioUnitario: 5.5,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.producto.findUnique.mockResolvedValue(mockData);

      const result = await repository.findById("test-id");

      expect(result).toBeDefined();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.producto.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.producto.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findByCodigo", () => {
    it("should return producto when found by codigo", async () => {
      const mockData = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia",
        precioUnitario: 5.5,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.producto.findUnique.mockResolvedValue(mockData);

      const result = await repository.findByCodigo("PROD-001");

      expect(result).toBeDefined();
      expect(result?.codigo).toBe("PROD-001");
    });

    it("should return null when not found", async () => {
      mockPrisma.producto.findUnique.mockResolvedValue(null);

      const result = await repository.findByCodigo("NON-EXISTENT");

      expect(result).toBeNull();
    });
  });

  describe("findAllPaginated", () => {
    it("should return paginated productos", async () => {
      const mockData = [
        {
          id: "id-1",
          codigo: "PROD-001",
          nombre: "Cerveza Cristal",
          descripcion: "Cerveza rubia",
          precioUnitario: 5.5,
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.producto.findMany.mockResolvedValue(mockData);
      mockPrisma.producto.count.mockResolvedValue(1);

      const result = await repository.findAllPaginated({ page: 1, limit: 10 });

      expect(result.list).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should return empty list when no productos", async () => {
      mockPrisma.producto.findMany.mockResolvedValue([]);
      mockPrisma.producto.count.mockResolvedValue(0);

      const result = await repository.findAllPaginated({ page: 1, limit: 10 });

      expect(result.list).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.hasNextPage).toBe(false);
    });

    it("should calculate pagination correctly", async () => {
      mockPrisma.producto.findMany.mockResolvedValue([]);
      mockPrisma.producto.count.mockResolvedValue(25);

      const result = await repository.findAllPaginated({ page: 2, limit: 10 });

      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });
  });

  describe("update", () => {
    it("should update producto", async () => {
      const mockData = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Heineken",
        descripcion: "Cerveza importada",
        precioUnitario: 7.0,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.producto.update.mockResolvedValue(mockData);

      const result = await repository.update("test-id", {
        nombre: "Cerveza Heineken",
        precioUnitario: 7.0,
        stock: 50,
      });

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Cerveza Heineken");
      expect(mockPrisma.producto.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete producto", async () => {
      mockPrisma.producto.delete.mockResolvedValue({});

      await repository.delete("test-id");

      expect(mockPrisma.producto.delete).toHaveBeenCalledWith({ where: { id: "test-id" } });
    });
  });
});