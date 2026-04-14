import { describe, it, expect, beforeEach, vi } from "vitest";
import { PromocionRepository } from "../../src/infrastructure/repositories/promocion.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { Prisma } from "../../generated/prisma/client";

describe("PromocionRepository", () => {
  let repository: PromocionRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();

    mockPrisma.promocion = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    };

    repository = new PromocionRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a promocion without habitaciones", async () => {
      const mockResult = {
        id: "promo-1",
        codigo: "PROMO-VERANO",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(15.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-08-31"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [],
      };

      mockPrisma.promocion.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        codigo: "PROMO-VERANO",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: 15.0,
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-08-31"),
      });

      expect(result.codigo).toBe("PROMO-VERANO");
      expect(result.tipoDescuento).toBe("PORCENTAJE");
      expect(result.valorDescuento).toBe(15.0);
      expect(result.habitaciones).toEqual([]);
      expect(mockPrisma.promocion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          codigo: "PROMO-VERANO",
          tipoDescuento: "PORCENTAJE",
          valorDescuento: 15.0,
        }),
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should create a promocion with habitaciones", async () => {
      const mockResult = {
        id: "promo-2",
        codigo: "PROMO-HAB",
        tipoDescuento: "MONTO_FIJO",
        valorDescuento: new Prisma.Decimal(50.0),
        vigDesde: new Date("2026-01-01"),
        vigHasta: new Date("2026-12-31"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [{ id: "hab-1" }, { id: "hab-2" }],
      };

      mockPrisma.promocion.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        codigo: "PROMO-HAB",
        tipoDescuento: "MONTO_FIJO",
        valorDescuento: 50.0,
        vigDesde: new Date("2026-01-01"),
        vigHasta: new Date("2026-12-31"),
        habitaciones: ["hab-1", "hab-2"],
      });

      expect(result.codigo).toBe("PROMO-HAB");
      expect(result.habitaciones).toEqual(["hab-1", "hab-2"]);
      expect(mockPrisma.promocion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          codigo: "PROMO-HAB",
          habitaciones: {
            connect: [{ id: "hab-1" }, { id: "hab-2" }],
          },
        }),
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should create a promocion with estado false", async () => {
      const mockResult = {
        id: "promo-3",
        codigo: "PROMO-INACTIVA",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(10.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-06-30"),
        estado: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [],
      };

      mockPrisma.promocion.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        codigo: "PROMO-INACTIVA",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: 10.0,
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-06-30"),
        estado: false,
      });

      expect(result.estado).toBe(false);
    });
  });

  describe("findAll", () => {
    it("should return empty array when no promociones exist", async () => {
      mockPrisma.promocion.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it("should return list with promociones and their habitaciones", async () => {
      const mockResults = [
        {
          id: "promo-1",
          codigo: "PROMO-1",
          tipoDescuento: "PORCENTAJE",
          valorDescuento: new Prisma.Decimal(10.0),
          vigDesde: new Date("2026-06-01"),
          vigHasta: new Date("2026-06-30"),
          estado: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          habitaciones: [{ id: "hab-1" }, { id: "hab-2" }],
        },
        {
          id: "promo-2",
          codigo: "PROMO-2",
          tipoDescuento: "MONTO_FIJO",
          valorDescuento: new Prisma.Decimal(25.0),
          vigDesde: new Date("2026-07-01"),
          vigHasta: new Date("2026-07-31"),
          estado: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          habitaciones: [],
        },
      ];

      mockPrisma.promocion.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result.length).toBe(2);
      expect(result[0].codigo).toBe("PROMO-1");
      expect(result[0].habitaciones).toEqual(["hab-1", "hab-2"]);
      expect(result[1].habitaciones).toEqual([]);
      expect(mockPrisma.promocion.findMany).toHaveBeenCalledWith({
        include: { habitaciones: { select: { id: true } } },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findById", () => {
    it("should find promocion by id with habitaciones", async () => {
      const mockResult = {
        id: "promo-123",
        codigo: "PROMO-VERANO",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(15.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-08-31"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [{ id: "hab-1" }],
      };

      mockPrisma.promocion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("promo-123");

      expect(result).toBeDefined();
      expect(result?.id).toBe("promo-123");
      expect(result?.habitaciones).toEqual(["hab-1"]);
      expect(mockPrisma.promocion.findUnique).toHaveBeenCalledWith({
        where: { id: "promo-123" },
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should return null when promocion not found", async () => {
      mockPrisma.promocion.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findByCodigo", () => {
    it("should find promocion by codigo", async () => {
      const mockResult = {
        id: "promo-1",
        codigo: "PROMO-UNIQUE",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(20.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-06-30"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [],
      };

      mockPrisma.promocion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findByCodigo("PROMO-UNIQUE");

      expect(result).toBeDefined();
      expect(result?.codigo).toBe("PROMO-UNIQUE");
      expect(mockPrisma.promocion.findUnique).toHaveBeenCalledWith({
        where: { codigo: "PROMO-UNIQUE" },
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should return null when codigo not found", async () => {
      mockPrisma.promocion.findUnique.mockResolvedValue(null);

      const result = await repository.findByCodigo("NONEXISTENT");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update promocion fields", async () => {
      const mockResult = {
        id: "promo-1",
        codigo: "PROMO-UPDATED",
        tipoDescuento: "MONTO_FIJO",
        valorDescuento: new Prisma.Decimal(30.0),
        vigDesde: new Date("2026-01-01"),
        vigHasta: new Date("2026-12-31"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [],
      };

      mockPrisma.promocion.update.mockResolvedValue(mockResult);

      const result = await repository.update("promo-1", {
        codigo: "PROMO-UPDATED",
        tipoDescuento: "MONTO_FIJO",
        valorDescuento: 30.0,
      });

      expect(result.codigo).toBe("PROMO-UPDATED");
      expect(mockPrisma.promocion.update).toHaveBeenCalledWith({
        where: { id: "promo-1" },
        data: expect.objectContaining({
          codigo: "PROMO-UPDATED",
          tipoDescuento: "MONTO_FIJO",
          valorDescuento: 30.0,
        }),
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should update habitaciones with set operation", async () => {
      const mockResult = {
        id: "promo-1",
        codigo: "PROMO-EXISTING",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(15.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-06-30"),
        estado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [{ id: "hab-1" }, { id: "hab-2" }, { id: "hab-3" }],
      };

      mockPrisma.promocion.update.mockResolvedValue(mockResult);

      await repository.update("promo-1", {
        habitaciones: ["hab-1", "hab-2", "hab-3"],
      });

      expect(mockPrisma.promocion.update).toHaveBeenCalledWith({
        where: { id: "promo-1" },
        data: expect.objectContaining({
          habitaciones: {
            set: [{ id: "hab-1" }, { id: "hab-2" }, { id: "hab-3" }],
          },
        }),
        include: { habitaciones: { select: { id: true } } },
      });
    });

    it("should update only estado field", async () => {
      const mockResult = {
        id: "promo-1",
        codigo: "PROMO-EXISTING",
        tipoDescuento: "PORCENTAJE",
        valorDescuento: new Prisma.Decimal(15.0),
        vigDesde: new Date("2026-06-01"),
        vigHasta: new Date("2026-06-30"),
        estado: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        habitaciones: [],
      };

      mockPrisma.promocion.update.mockResolvedValue(mockResult);

      const result = await repository.update("promo-1", {
        estado: false,
      });

      expect(result.estado).toBe(false);
      expect(mockPrisma.promocion.update).toHaveBeenCalledWith({
        where: { id: "promo-1" },
        data: expect.objectContaining({
          estado: false,
        }),
        include: { habitaciones: { select: { id: true } } },
      });
    });
  });

  describe("delete", () => {
    it("should delete promocion", async () => {
      mockPrisma.promocion.delete.mockResolvedValue(undefined);

      await repository.delete("promo-to-delete");

      expect(mockPrisma.promocion.delete).toHaveBeenCalledWith({
        where: { id: "promo-to-delete" },
      });
    });
  });
});
