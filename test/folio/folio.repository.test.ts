import { describe, it, expect, beforeEach, vi } from "vitest";
import { FolioRepository } from "../../src/infrastructure/repositories/folio.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";

describe("FolioRepository", () => {
  let repository: FolioRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();

    mockPrisma.folio = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockPrisma.folioProducto = {
      create: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
    };

    mockPrisma.folioServicio = {
      create: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
    };

    mockPrisma.producto = {
      update: vi.fn(),
    };

    repository = new FolioRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a folio without promociones", async () => {
      const mockResult = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        estanciaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: null,
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        estanciaId: "estancia-1",
      });

      expect(result.estanciaId).toBe("estancia-1");
      expect(result.codigo).toBe("FOL-260416-1");
      expect(result.estado).toBe(true);
      expect(result.promociones).toEqual([]);
      expect(mockPrisma.folio.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          estanciaId: "estancia-1",
          estado: true,
          observacion: null,
        }),
        include: { promociones: { select: { codigo: true } } },
      });
    });

    it("should create a folio with promociones", async () => {
      const mockResult = {
        id: "folio-2",
        codigo: "FOL-260416-2",
        estanciaId: "estancia-2",
        pagoId: null,
        estado: true,
        observacion: "Folio con promociones",
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [{ codigo: "PROMO-VERANO" }, { codigo: "PROMO-DESCUENTO" }],
      };

      mockPrisma.folio.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        estanciaId: "estancia-2",
        observacion: "Folio con promociones",
        promocionIds: ["promo-1", "promo-2"],
      });

      expect(result.estanciaId).toBe("estancia-2");
      expect(result.promociones).toEqual(["PROMO-VERANO", "PROMO-DESCUENTO"]);
      expect(mockPrisma.folio.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          estanciaId: "estancia-2",
          promociones: {
            connect: [{ id: "promo-1" }, { id: "promo-2" }],
          },
        }),
        include: { promociones: { select: { codigo: true } } },
      });
    });
  });

  describe("findAll", () => {
    it("should return empty array when no folios exist", async () => {
      mockPrisma.folio.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it("should return list with folios and their promociones", async () => {
      const mockResults = [
        {
          id: "folio-1",
          codigo: "FOL-260416-1",
          estanciaId: "estancia-1",
          pagoId: null,
          estado: true,
          observacion: null,
          cerradoEn: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [{ codigo: "PROMO-1" }],
        },
        {
          id: "folio-2",
          codigo: "FOL-260416-2",
          estanciaId: "estancia-1",
          pagoId: "pago-1",
          estado: false,
          observacion: "Folio cerrado",
          cerradoEn: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [],
        },
      ];

      mockPrisma.folio.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result.length).toBe(2);
      expect(result[0].codigo).toBe("FOL-260416-1");
      expect(result[0].promociones).toEqual(["PROMO-1"]);
      expect(result[1].estado).toBe(false);
      expect(mockPrisma.folio.findMany).toHaveBeenCalledWith({
        include: { promociones: { select: { codigo: true } } },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findById", () => {
    it("should find folio by id with promociones", async () => {
      const mockResult = {
        id: "folio-123",
        codigo: "FOL-260416-5",
        estanciaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: "Folio de prueba",
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [{ codigo: "PROMO-VERANO" }],
      };

      mockPrisma.folio.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("folio-123");

      expect(result).toBeDefined();
      expect(result?.id).toBe("folio-123");
      expect(result?.codigo).toBe("FOL-260416-5");
      expect(result?.promociones).toEqual(["PROMO-VERANO"]);
      expect(mockPrisma.folio.findUnique).toHaveBeenCalledWith({
        where: { id: "folio-123" },
        include: { promociones: { select: { codigo: true } } },
      });
    });

    it("should return null when folio not found", async () => {
      mockPrisma.folio.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("findByEstanciaId", () => {
    it("should return folios for a specific estancia", async () => {
      const mockResults = [
        {
          id: "folio-1",
          codigo: "FOL-260416-1",
          estanciaId: "estancia-1",
          pagoId: null,
          estado: true,
          observacion: null,
          cerradoEn: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [],
        },
        {
          id: "folio-2",
          codigo: "FOL-260416-2",
          estanciaId: "estancia-1",
          pagoId: "pago-1",
          estado: false,
          observacion: "Cerrado",
          cerradoEn: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [{ codigo: "PROMO-1" }],
        },
      ];

      mockPrisma.folio.findMany.mockResolvedValue(mockResults);

      const result = await repository.findByEstanciaId("estancia-1");

      expect(result.length).toBe(2);
      expect(result[0].codigo).toBe("FOL-260416-1");
      expect(result[1].codigo).toBe("FOL-260416-2");
      expect(mockPrisma.folio.findMany).toHaveBeenCalledWith({
        where: { estanciaId: "estancia-1" },
        include: { promociones: { select: { codigo: true } } },
        orderBy: { createdAt: "asc" },
      });
    });
  });

  describe("findOpenByEstanciaId", () => {
    it("should return open folio for a specific estancia", async () => {
      const mockResult = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        estanciaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: null,
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.findFirst.mockResolvedValue(mockResult);

      const result = await repository.findOpenByEstanciaId("estancia-1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("folio-1");
      expect(result?.estado).toBe(true);
      expect(mockPrisma.folio.findFirst).toHaveBeenCalledWith({
        where: {
          estanciaId: "estancia-1",
          estado: true,
        },
        include: { promociones: { select: { codigo: true } } },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return null when no open folio exists", async () => {
      mockPrisma.folio.findFirst.mockResolvedValue(null);

      const result = await repository.findOpenByEstanciaId("estancia-1");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update folio fields", async () => {
      const mockResult = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        estanciaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: "Observación actualizada",
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.update.mockResolvedValue(mockResult);

      const result = await repository.update("folio-1", {
        observacion: "Observación actualizada",
      });

      expect(result.observacion).toBe("Observación actualizada");
      expect(mockPrisma.folio.update).toHaveBeenCalledWith({
        where: { id: "folio-1" },
        data: expect.objectContaining({
          observacion: "Observación actualizada",
        }),
        include: { promociones: { select: { codigo: true } } },
      });
    });

    it("should update promociones with set operation", async () => {
      const mockResult = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        estanciaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: null,
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [{ codigo: "PROMO-NUEVA" }],
      };

      mockPrisma.folio.update.mockResolvedValue(mockResult);

      await repository.update("folio-1", {
        promocionIds: ["promo-nueva-id"],
      });

      expect(mockPrisma.folio.update).toHaveBeenCalledWith({
        where: { id: "folio-1" },
        data: expect.objectContaining({
          promociones: {
            set: [{ id: "promo-nueva-id" }],
          },
        }),
        include: { promociones: { select: { codigo: true } } },
      });
    });
  });

  describe("delete", () => {
    it("should delete folio", async () => {
      mockPrisma.folio.delete.mockResolvedValue(undefined);

      await repository.delete("folio-to-delete");

      expect(mockPrisma.folio.delete).toHaveBeenCalledWith({
        where: { id: "folio-to-delete" },
      });
    });
  });

  describe.skip("addProducto", () => {
    it("should add producto to folio", async () => {
      const mockFolioProducto = {
        id: "folio-producto-1",
        folioId: "folio-1",
        productoId: "producto-1",
        cantidad: 2,
        precioUnit: 10,
        total: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.folioProducto.create.mockResolvedValue(mockFolioProducto);

      const result = await repository.addProducto({
        folioId: "folio-1",
        productoId: "producto-1",
        cantidad: 2,
        precioUnit: 10,
      });

      expect(result.folioId).toBe("folio-1");
      expect(result.productoId).toBe("producto-1");
      expect(result.total).toBe(20);
    });
  });

  describe("addServicio", () => {
    it("should add servicio to folio", async () => {
      const mockFolioServicio = {
        id: "folio-servicio-1",
        folioId: "folio-1",
        concepto: "Masaje",
        cantidad: 1,
        precioUnit: 50,
        total: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.folioServicio.create.mockResolvedValue(mockFolioServicio);

      const result = await repository.addServicio({
        folioId: "folio-1",
        concepto: "Masaje",
        cantidad: 1,
        precioUnit: 50,
      });

      expect(result.folioId).toBe("folio-1");
      expect(result.concepto).toBe("Masaje");
      expect(result.total).toBe(50);
      expect(mockPrisma.folioServicio.create).toHaveBeenCalledWith({
        data: {
          folioId: "folio-1",
          concepto: "Masaje",
          cantidad: 1,
          precioUnit: 50,
          total: 50,
        },
      });
    });
  });

  describe("getConsumos", () => {
    it("should return productos and servicios for a folio", async () => {
      const mockProductos = [
        {
          id: "fp-1",
          folioId: "folio-1",
          productoId: "producto-1",
          cantidad: 2,
          precioUnit: 10,
          total: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockServicios = [
        {
          id: "fs-1",
          folioId: "folio-1",
          concepto: "Masaje",
          cantidad: 1,
          precioUnit: 50,
          total: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.folioProducto.findMany.mockResolvedValue(mockProductos);
      mockPrisma.folioServicio.findMany.mockResolvedValue(mockServicios);

      const result = await repository.getConsumos("folio-1");

      expect(result.productos.length).toBe(1);
      expect(result.servicios.length).toBe(1);
    });
  });

  describe("getTotal", () => {
    it("should return total sum of productos and servicios", async () => {
      mockPrisma.folioProducto.aggregate.mockResolvedValue({ _sum: { total: 100 } });
      mockPrisma.folioServicio.aggregate.mockResolvedValue({ _sum: { total: 50 } });

      const result = await repository.getTotal("folio-1");

      expect(result).toBe(150);
    });

    it("should return 0 when no consumos", async () => {
      mockPrisma.folioProducto.aggregate.mockResolvedValue({ _sum: { total: null } });
      mockPrisma.folioServicio.aggregate.mockResolvedValue({ _sum: { total: null } });

      const result = await repository.getTotal("folio-1");

      expect(result).toBe(0);
    });
  });

  describe("closeWithPago", () => {
    it("should close folio with pagoId", async () => {
      const closedAt = new Date();
      vi.useFakeTimers();
      vi.setSystemTime(closedAt);

      const mockResult = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        estanciaId: "estancia-1",
        pagoId: "pago-1",
        estado: false,
        observacion: null,
        cerradoEn: closedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.update.mockResolvedValue(mockResult);

      const result = await repository.closeWithPago("folio-1", "pago-1");

      expect(result.estado).toBe(false);
      expect(result.pagoId).toBe("pago-1");
      expect(result.cerradoEn).toEqual(closedAt);
      expect(mockPrisma.folio.update).toHaveBeenCalledWith({
        where: { id: "folio-1" },
        data: {
          estado: false,
          cerradoEn: closedAt,
          pagoId: "pago-1",
        },
        include: { promociones: { select: { codigo: true } } },
      });

      vi.useRealTimers();
    });
  });
});
