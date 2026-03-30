import { describe, it, expect, beforeEach, vi } from "vitest";
import { HabitacionRepository } from "../../src/infrastructure/repositories/habitacion.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { Prisma } from "../../generated/prisma/client";

describe("HabitacionRepository", () => {
  let repository: HabitacionRepository;
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
    mockPrisma.estancia = { count: vi.fn() };
    repository = new HabitacionRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a habitacion", async () => {
      const input = {
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: ["https://example.com/301.jpg"],
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: ["https://example.com/301.jpg"],
        estado: false,
        descripcion: null,
        tipo: {
          id: "tipo-id",
          nombre: "Suite",
          descripcion: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nroHabitacion).toBe("301");
      expect(result.piso).toBe(3);
      expect(mockPrisma.habitacion.create).toHaveBeenCalled();
    });

    it("should propagate Prisma errors on duplicate nroHabitacion", async () => {
      const input = {
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
      };

      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.create.mockRejectedValue(error);

      await expect(repository.create(input)).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe("findAll", () => {
    it("should return all habitaciones ordered by nroHabitacion ASC", async () => {
      const mockResults = [
        {
          id: "id-1",
          nroHabitacion: "101",
          tipoHabitacionId: "tipo-id",
          piso: 1,
          tieneDucha: false,
          tieneBanio: true,
          urlImagen: null,
          estado: false,
          descripcion: null,
          tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date("2026-03-17T10:00:00.000Z"),
          updatedAt: new Date("2026-03-17T10:00:00.000Z"),
        },
        {
          id: "id-2",
          nroHabitacion: "102",
          tipoHabitacionId: "tipo-id",
          piso: 1,
          tieneDucha: true,
          tieneBanio: true,
          urlImagen: null,
          estado: true,
          descripcion: null,
          tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date("2026-03-16T10:00:00.000Z"),
          updatedAt: new Date("2026-03-16T10:00:00.000Z"),
        },
      ];

      mockPrisma.habitacion.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].nroHabitacion).toBe("101");
      expect(mockPrisma.habitacion.findMany).toHaveBeenCalledWith({
        include: { tipo: true },
        orderBy: { nroHabitacion: "asc" },
      });
    });
  });

  describe("findById", () => {
    it("should find habitacion by id", async () => {
      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: null,
        estado: false,
        descripcion: null,
        tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.habitacion.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
        include: { tipo: true },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.habitacion.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByNumero", () => {
    it("should find habitacion by numero", async () => {
      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: null,
        estado: false,
        descripcion: null,
        tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findByNumero("301");

      expect(result).not.toBeNull();
      expect(result?.nroHabitacion).toBe("301");
    });
  });

  describe("update", () => {
    it("should update habitacion", async () => {
      const updateData = {
        nroHabitacion: "302",
        descripcion: "Descripcion actualizada",
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "302",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: null,
        estado: false,
        descripcion: "Descripcion actualizada",
        tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-id", updateData);

      expect(result.nroHabitacion).toBe("302");
      expect(result.descripcion).toBe("Descripcion actualizada");
      expect(mockPrisma.habitacion.update).toHaveBeenCalled();
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.update.mockRejectedValue(error);

      await expect(repository.update("non-existent-id", { descripcion: "Test" })).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update only estado", async () => {
      const updateData = {
        estado: true,
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoHabitacionId: "tipo-id",
        piso: 3,
        tieneDucha: true,
        tieneBanio: true,
        urlImagen: null,
        estado: true,
        descripcion: null,
        tipo: {
            id: "tipo-id",
            nombre: "Suite",
            descripcion: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.updateStatus("test-id", updateData);

      expect(result.estado).toBe(true);
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.update.mockRejectedValue(error);

      await expect(repository.updateStatus("non-existent-id", { estado: true })).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError,
      );
    });
  });

  describe("delete", () => {
    it("should delete habitacion", async () => {
      mockPrisma.habitacion.delete.mockResolvedValue({});

      await repository.delete("test-id");

      expect(mockPrisma.habitacion.delete).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.delete.mockRejectedValue(error);

      await expect(repository.delete("non-existent-id")).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe("hasRelatedRecords", () => {
    it("should return true when has related estancias", async () => {
      mockPrisma.estancia.count.mockResolvedValue(1);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(true);
    });

    it("should return false when has no related records", async () => {
      mockPrisma.estancia.count.mockResolvedValue(0);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(false);
    });
  });
});
