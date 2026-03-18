import { describe, it, expect, beforeEach, vi } from "vitest";
import { HabitacionRepository } from "../../src/infrastructure/repositories/habitacion.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { HabitacionException } from "../../src/domain/exceptions/habitacion.exception";
import { Prisma } from "../../generated/prisma/client";
import { EstadoHabitacion, EstadoLimpieza } from "../../src/domain/entities/habitacion.entity";

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
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: "https://example.com/301.jpg",
        muebles: [{ id: "mueble-1", codigo: "CAMA-01", nombre: "Cama", categoria: "CAMA" }],
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: "https://example.com/301.jpg",
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: null,
        tipo: {
          id: "tipo-id",
          nombre: "Suite",
          descripcion: null,
        },
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

      mockPrisma.habitacion.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nroHabitacion).toBe("301");
      expect(result.piso).toBe(3);
      expect(mockPrisma.habitacion.create).toHaveBeenCalled();
    });

    it("should throw exception on duplicate nroHabitacion", async () => {
      const input = {
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
      };

      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.create.mockRejectedValue(error);

      await expect(repository.create(input)).rejects.toThrow(HabitacionException);
    });
  });

  describe("findAll", () => {
    it("should return all habitaciones ordered by nroHabitacion ASC", async () => {
      const mockResults = [
        {
          id: "id-1",
          nroHabitacion: "101",
          tipoId: "tipo-id",
          piso: 1,
          urlImagen: null,
          estado: "DISPONIBLE",
          limpieza: "LIMPIA",
          notas: null,
          ultimaLimpieza: null,
          tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
          muebles: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "id-2",
          nroHabitacion: "102",
          tipoId: "tipo-id",
          piso: 1,
          urlImagen: null,
          estado: "OCUPADA",
          limpieza: "SUCIA",
          notas: null,
          ultimaLimpieza: null,
          tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
          muebles: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.habitacion.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].nroHabitacion).toBe("101");
      expect(mockPrisma.habitacion.findMany).toHaveBeenCalledWith({
        include: { tipo: true, muebles: true },
        orderBy: { nroHabitacion: "asc" },
      });
    });
  });

  describe("findById", () => {
    it("should find habitacion by id", async () => {
      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: null,
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: null,
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-id");
      expect(mockPrisma.habitacion.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id" },
        include: { tipo: true, muebles: true },
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
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: null,
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: null,
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findByNumero("301");

      expect(result).not.toBeNull();
      expect(result?.nroHabitacion).toBe("301");
      expect(mockPrisma.habitacion.findUnique).toHaveBeenCalledWith({
        where: { nroHabitacion: "301" },
        include: { tipo: true, muebles: true },
      });
    });
  });

  describe("update", () => {
    it("should update habitacion", async () => {
      const updateData = {
        nroHabitacion: "301-A",
        piso: 4,
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301-A",
        tipoId: "tipo-id",
        piso: 4,
        urlImagen: null,
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: null,
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-id", updateData);

      expect(result.nroHabitacion).toBe("301-A");
      expect(result.piso).toBe(4);
      expect(mockPrisma.habitacion.update).toHaveBeenCalled();
    });

    it("should set ultimaLimpieza when estado changes to LIMPIEZA", async () => {
      const updateData = {
        estado: EstadoHabitacion.LIMPIEZA,
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: null,
        estado: "LIMPIEZA",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: new Date(),
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-id", updateData);

      expect(result.estado).toBe(EstadoHabitacion.LIMPIEZA);
      expect(mockPrisma.habitacion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ultimaLimpieza: expect.any(Date),
          }),
        }),
      );
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.update.mockRejectedValue(error);

      await expect(repository.update("non-existent-id", { piso: 2 })).rejects.toThrow(HabitacionException);
    });

    it("should throw exception on duplicate nroHabitacion", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.update.mockRejectedValue(error);

      await expect(repository.update("test-id", { nroHabitacion: "301" })).rejects.toThrow(HabitacionException);
    });
  });

  describe("updateStatus", () => {
    it("should update only estado and limpieza", async () => {
      const updateData = {
        estado: EstadoHabitacion.OCUPADA,
        limpieza: EstadoLimpieza.SUCIA,
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: null,
        estado: "OCUPADA",
        limpieza: "SUCIA",
        notas: null,
        ultimaLimpieza: null,
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.updateStatus("test-id", updateData);

      expect(result.estado).toBe(EstadoHabitacion.OCUPADA);
      expect(result.limpieza).toBe(EstadoLimpieza.SUCIA);
    });

    it("should set ultimaLimpieza when limpieza changes to LIMPIA", async () => {
      const updateData = {
        limpieza: EstadoLimpieza.LIMPIA,
      };

      const mockResult = {
        id: "test-id",
        nroHabitacion: "301",
        tipoId: "tipo-id",
        piso: 3,
        urlImagen: null,
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultimaLimpieza: new Date(),
        tipo: { id: "tipo-id", nombre: "Suite", descripcion: null },
        muebles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.habitacion.update.mockResolvedValue(mockResult);

      const result = await repository.updateStatus("test-id", updateData);

      expect(result.limpieza).toBe(EstadoLimpieza.LIMPIA);
      expect(mockPrisma.habitacion.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ultimaLimpieza: expect.any(Date),
          }),
        }),
      );
    });

    it("should throw exception when not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      mockPrisma.habitacion.update.mockRejectedValue(error);

      await expect(repository.updateStatus("non-existent-id", { estado: EstadoHabitacion.OCUPADA })).rejects.toThrow(
        HabitacionException,
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

      await expect(repository.delete("non-existent-id")).rejects.toThrow(HabitacionException);
    });
  });

  describe("hasRelatedRecords", () => {
    it("should return true when has related estancias", async () => {
      mockPrisma.estancia.count.mockResolvedValue(1);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(true);
      expect(mockPrisma.estancia.count).toHaveBeenCalledWith({
        where: { habitacionId: "test-id" },
      });
    });

    it("should return false when has no related estancias", async () => {
      mockPrisma.estancia.count.mockResolvedValue(0);

      const result = await repository.hasRelatedRecords("test-id");

      expect(result).toBe(false);
    });
  });
});
