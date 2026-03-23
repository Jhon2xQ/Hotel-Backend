import { describe, it, expect, beforeEach, vi } from "vitest";
import { TipoHabitacionRepository } from "../../src/infrastructure/repositories/tipo-habitacion.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { TipoHabitacionException } from "../../src/domain/exceptions/tipo-habitacion.exception";
import { Prisma } from "../../generated/prisma/client";

describe("TipoHabitacionRepository", () => {
  let repository: TipoHabitacionRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.tipoHabitacion = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    mockPrisma.habitacion = { count: vi.fn() };
    repository = new TipoHabitacionRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a tipo habitacion", async () => {
      const input = {
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tieneDucha: true,
        tieneBanio: true,
        muebles: [{ id: "mueble-1", codigo: "CAMA-01", nombre: "Cama", categoria: "CAMA" }],
      };

      const mockResult = {
        id: "test-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tieneDucha: true,
        tieneBanio: true,
        muebles: [
          {
            id: "mueble-1",
            codigo: "CAMA-01",
            nombre: "Cama",
            categoria: "CAMA",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.tipoHabitacion.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nombre).toBe("Suite Deluxe");
      expect(mockPrisma.tipoHabitacion.create).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all tipo habitacion ordered by createdAt DESC", async () => {
      const mockResults = [
        {
          id: "id-1",
          nombre: "Suite Deluxe",
          descripcion: "Suite de lujo",
          tieneDucha: true,
          tieneBanio: true,
          muebles: [],
          createdAt: new Date("2026-03-17T10:00:00.000Z"),
          updatedAt: new Date("2026-03-17T10:00:00.000Z"),
        },
        {
          id: "id-2",
          nombre: "Standard",
          descripcion: null,
          tieneDucha: false,
          tieneBanio: true,
          muebles: [],
          createdAt: new Date("2026-03-16T10:00:00.000Z"),
          updatedAt: new Date("2026-03-16T10:00:00.000Z"),
        },
      ];

      mockPrisma.tipoHabitacion.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe("Suite Deluxe");
      expect(mockPrisma.tipoHabitacion.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findById", () => {
    it("should find tipo habitacion by id", async () => {
      const mockResult = {
        id: "test-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tieneDucha: true,
        tieneBanio: true,
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.tipoHabitacion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.tipoHabitacion.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.tipoHabitacion.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update tipo habitacion", async () => {
      const updateData = {
        nombre: "Suite Deluxe Premium",
        descripcion: "Descripción actualizada",
      };

      const existingResult = {
        id: "test-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tieneDucha: true,
        tieneBanio: true,
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResult = {
        id: "test-id",
        nombre: "Suite Deluxe Premium",
        descripcion: "Descripción actualizada",
        tieneDucha: true,
        tieneBanio: true,
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.tipoHabitacion.findUnique.mockResolvedValue(existingResult);
      mockPrisma.tipoHabitacion.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-id", updateData);

      expect(result.nombre).toBe("Suite Deluxe Premium");
      expect(mockPrisma.tipoHabitacion.findUnique).toHaveBeenCalled();
      expect(mockPrisma.tipoHabitacion.update).toHaveBeenCalled();
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.tipoHabitacion.update.mockRejectedValue(error);

      await expect(repository.update("non-existent-id", { nombre: "Test" })).rejects.toThrow(TipoHabitacionException);
    });
  });

  describe("delete", () => {
    it("should delete tipo habitacion", async () => {
      mockPrisma.tipoHabitacion.delete.mockResolvedValue({});

      await repository.delete("test-id");

      expect(mockPrisma.tipoHabitacion.delete).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.tipoHabitacion.delete.mockRejectedValue(error);

      await expect(repository.delete("non-existent-id")).rejects.toThrow(TipoHabitacionException);
    });
  });

  describe("hasRelatedRecords", () => {
    it("should return true when has related habitaciones", async () => {
      mockPrisma.habitacion.count.mockResolvedValue(1);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(true);
    });

    it("should return false when has no related records", async () => {
      mockPrisma.habitacion.count.mockResolvedValue(0);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(false);
    });
  });
});
