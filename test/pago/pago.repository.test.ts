import { describe, it, expect, beforeEach, vi } from "vitest";
import { PagoRepository } from "../../src/infrastructure/repositories/pago.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../src/domain/entities/pago.entity";
import { PagoException } from "../../src/domain/exceptions/pago.exception";
import { Prisma } from "../../generated/prisma/client";

describe("PagoRepository", () => {
  let repository: PagoRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.pago = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    repository = new PagoRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a pago", async () => {
      const input = {
        concepto: ConceptoPago.RESERVA,
        monto: 150.0,
        metodo: MetodoPago.EFECTIVO,
      };

      const mockResult = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fechaPago: new Date("2026-03-18T14:30:00.000Z"),
        monto: new Prisma.Decimal(150.0),
        moneda: "SOL",
        metodo: "EFECTIVO",
        recibidoPorId: null,
        recibidoPor: null,
        observacion: null,
        createdAt: new Date(),
      };

      mockPrisma.pago.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.concepto).toBe(ConceptoPago.RESERVA);
      expect(result.monto).toBe(150.0);
      expect(result.metodo).toBe(MetodoPago.EFECTIVO);
      expect(mockPrisma.pago.create).toHaveBeenCalled();
    });

    it("should create pago with all fields", async () => {
      const input = {
        concepto: ConceptoPago.CONSUMO,
        estado: EstadoPago.CONFIRMADO,
        fechaPago: new Date("2026-03-20T10:00:00.000Z"),
        monto: 200.0,
        moneda: "PEN",
        metodo: MetodoPago.VISA,
        recibidoPorId: "user-123",
        observacion: "Pago por servicios",
      };

      const mockResult = {
        id: "test-pago-id",
        concepto: "CONSUMO",
        estado: "CONFIRMADO",
        fechaPago: new Date("2026-03-20T10:00:00.000Z"),
        monto: new Prisma.Decimal(200.0),
        moneda: "PEN",
        metodo: "VISA",
        recibidoPorId: "user-123",
        recibidoPor: {
          id: "user-123",
          name: "Juan Pérez",
          email: "juan.perez@hotel.com",
        },
        observacion: "Pago por servicios",
        createdAt: new Date(),
      };

      mockPrisma.pago.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.concepto).toBe(ConceptoPago.CONSUMO);
      expect(result.estado).toBe(EstadoPago.CONFIRMADO);
      expect(result.moneda).toBe("PEN");
      expect(result.recibidoPorId).toBe("user-123");
    });
  });

  describe("findAll", () => {
    it("should return all pagos ordered by createdAt DESC", async () => {
      const mockResults = [
        {
          id: "pago-1",
          concepto: "RESERVA",
          estado: "CONFIRMADO",
          fechaPago: new Date("2026-03-18T14:30:00.000Z"),
          monto: new Prisma.Decimal(150.0),
          moneda: "SOL",
          metodo: "EFECTIVO",
          recibidoPorId: null,
          recibidoPor: null,
          observacion: null,
          createdAt: new Date("2026-03-18T14:30:00.000Z"),
        },
        {
          id: "pago-2",
          concepto: "CONSUMO",
          estado: "CONFIRMADO",
          fechaPago: new Date("2026-03-17T10:00:00.000Z"),
          monto: new Prisma.Decimal(200.0),
          moneda: "SOL",
          metodo: "VISA",
          recibidoPorId: null,
          recibidoPor: null,
          observacion: null,
          createdAt: new Date("2026-03-17T10:00:00.000Z"),
        },
      ];

      mockPrisma.pago.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("pago-1");
      expect(result[1].id).toBe("pago-2");
      expect(mockPrisma.pago.findMany).toHaveBeenCalledWith({
        include: { recibidoPor: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when no pagos exist", async () => {
      mockPrisma.pago.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should find pago by id", async () => {
      const mockResult = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fechaPago: new Date("2026-03-18T14:30:00.000Z"),
        monto: new Prisma.Decimal(150.0),
        moneda: "SOL",
        metodo: "EFECTIVO",
        recibidoPorId: null,
        recibidoPor: null,
        observacion: null,
        createdAt: new Date(),
      };

      mockPrisma.pago.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-pago-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-pago-id");
      expect(mockPrisma.pago.findUnique).toHaveBeenCalledWith({
        where: { id: "test-pago-id" },
        include: { recibidoPor: true },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.pago.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });

    it("should include recibidoPor data", async () => {
      const mockResult = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fechaPago: new Date("2026-03-18T14:30:00.000Z"),
        monto: new Prisma.Decimal(150.0),
        moneda: "SOL",
        metodo: "EFECTIVO",
        recibidoPorId: "user-123",
        recibidoPor: {
          id: "user-123",
          name: "Juan Pérez",
          email: "juan.perez@hotel.com",
        },
        observacion: null,
        createdAt: new Date(),
      };

      mockPrisma.pago.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-pago-id");

      expect(result?.recibidoPor).toBeDefined();
      expect(result?.recibidoPor?.name).toBe("Juan Pérez");
    });
  });

  describe("update", () => {
    it("should update pago", async () => {
      const updateData = {
        estado: EstadoPago.DEVUELTO,
        observacion: "Pago devuelto",
      };

      const mockResult = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "DEVUELTO",
        fechaPago: new Date("2026-03-18T14:30:00.000Z"),
        monto: new Prisma.Decimal(150.0),
        moneda: "SOL",
        metodo: "EFECTIVO",
        recibidoPorId: null,
        recibidoPor: null,
        observacion: "Pago devuelto",
        createdAt: new Date(),
      };

      mockPrisma.pago.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-pago-id", updateData);

      expect(result.estado).toBe(EstadoPago.DEVUELTO);
      expect(result.observacion).toBe("Pago devuelto");
      expect(mockPrisma.pago.update).toHaveBeenCalled();
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.pago.update.mockRejectedValue(error);

      await expect(repository.update("non-existent-id", { observacion: "Test" })).rejects.toThrow(PagoException);
    });

    it("should update monto correctly", async () => {
      const updateData = {
        monto: 250.0,
      };

      const mockResult = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fechaPago: new Date("2026-03-18T14:30:00.000Z"),
        monto: new Prisma.Decimal(250.0),
        moneda: "SOL",
        metodo: "EFECTIVO",
        recibidoPorId: null,
        recibidoPor: null,
        observacion: null,
        createdAt: new Date(),
      };

      mockPrisma.pago.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-pago-id", updateData);

      expect(result.monto).toBe(250.0);
    });
  });

  describe("delete", () => {
    it("should delete pago", async () => {
      mockPrisma.pago.delete.mockResolvedValue({});

      await repository.delete("test-pago-id");

      expect(mockPrisma.pago.delete).toHaveBeenCalledWith({
        where: { id: "test-pago-id" },
      });
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.pago.delete.mockRejectedValue(error);

      await expect(repository.delete("non-existent-id")).rejects.toThrow(PagoException);
    });
  });
});
