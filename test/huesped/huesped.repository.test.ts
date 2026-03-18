import { describe, it, expect, beforeEach, vi } from "vitest";
import { HuespedRepository } from "../../src/infrastructure/repositories/huesped.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { HuespedException } from "../../src/domain/exceptions/huesped.exception";
import { Prisma } from "../../generated/prisma/client";

describe("HuespedRepository", () => {
  let repository: HuespedRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    mockPrisma.huesped = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    repository = new HuespedRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a huesped", async () => {
      const input = {
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
      };

      const mockResult = {
        id: "test-huesped-id",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        nivelVip: 0,
        notas: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(null);
      mockPrisma.huesped.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nombres).toBe("Juan Carlos");
      expect(result.apellidos).toBe("Pérez García");
      expect(result.email).toBe("juan.perez@example.com");
      expect(mockPrisma.huesped.create).toHaveBeenCalled();
    });

    it("should throw error if email already exists", async () => {
      const input = {
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
      };

      mockPrisma.huesped.findUnique.mockResolvedValue({
        id: "existing-id",
        email: "juan.perez@example.com",
      });

      await expect(repository.create(input)).rejects.toThrow(HuespedException);
    });

    it("should create huesped with all fields", async () => {
      const input = {
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        nivelVip: 2,
        notas: "Cliente VIP",
      };

      const mockResult = {
        id: "test-huesped-id",
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        nivelVip: 2,
        notas: "Cliente VIP",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(null);
      mockPrisma.huesped.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nivelVip).toBe(2);
      expect(result.notas).toBe("Cliente VIP");
    });
  });

  describe("findAll", () => {
    it("should return all huespedes ordered by createdAt DESC", async () => {
      const mockResults = [
        {
          id: "huesped-1",
          nombres: "Juan",
          apellidos: "Pérez",
          email: "juan@example.com",
          telefono: "+51987654321",
          nacionalidad: "Perú",
          nivelVip: 0,
          notas: null,
          createdAt: new Date("2026-03-18T14:30:00.000Z"),
          updatedAt: new Date("2026-03-18T14:30:00.000Z"),
        },
        {
          id: "huesped-2",
          nombres: "María",
          apellidos: "García",
          email: "maria@example.com",
          telefono: "+51912345678",
          nacionalidad: "Argentina",
          nivelVip: 1,
          notas: null,
          createdAt: new Date("2026-03-17T10:00:00.000Z"),
          updatedAt: new Date("2026-03-17T10:00:00.000Z"),
        },
      ];

      mockPrisma.huesped.findMany.mockResolvedValue(mockResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("huesped-1");
      expect(result[1].id).toBe("huesped-2");
      expect(mockPrisma.huesped.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when no huespedes exist", async () => {
      mockPrisma.huesped.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should find huesped by id", async () => {
      const mockResult = {
        id: "test-huesped-id",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        nivelVip: 0,
        notas: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(mockResult);

      const result = await repository.findById("test-huesped-id");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-huesped-id");
      expect(mockPrisma.huesped.findUnique).toHaveBeenCalledWith({
        where: { id: "test-huesped-id" },
      });
    });

    it("should return null when not found", async () => {
      mockPrisma.huesped.findUnique.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update huesped", async () => {
      const updateData = {
        telefono: "+51999999999",
        nivelVip: 1,
      };

      const existingHuesped = {
        id: "test-huesped-id",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        nivelVip: 0,
        notas: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResult = {
        ...existingHuesped,
        telefono: "+51999999999",
        nivelVip: 1,
        updatedAt: new Date(),
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(existingHuesped);
      mockPrisma.huesped.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-huesped-id", updateData);

      expect(result.telefono).toBe("+51999999999");
      expect(result.nivelVip).toBe(1);
      expect(mockPrisma.huesped.update).toHaveBeenCalled();
    });

    it("should throw exception when huesped not found", async () => {
      mockPrisma.huesped.findUnique.mockResolvedValue(null);

      await expect(repository.update("non-existent-id", { telefono: "+51999999999" })).rejects.toThrow(
        HuespedException,
      );
    });

    it("should throw exception when updating to duplicate email", async () => {
      const existingHuesped = {
        id: "test-huesped-id",
        email: "juan.perez@example.com",
      };

      const anotherHuesped = {
        id: "another-id",
        email: "maria@example.com",
      };

      mockPrisma.huesped.findUnique.mockResolvedValueOnce(existingHuesped).mockResolvedValueOnce(anotherHuesped);

      await expect(repository.update("test-huesped-id", { email: "maria@example.com" })).rejects.toThrow(
        HuespedException,
      );
    });

    it("should allow updating to same email", async () => {
      const existingHuesped = {
        id: "test-huesped-id",
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        nivelVip: 0,
        notas: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(existingHuesped);
      mockPrisma.huesped.update.mockResolvedValue(existingHuesped);

      const result = await repository.update("test-huesped-id", {
        email: "juan.perez@example.com",
        telefono: "+51999999999",
      });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete huesped", async () => {
      const existingHuesped = {
        id: "test-huesped-id",
        email: "juan.perez@example.com",
      };

      mockPrisma.huesped.findUnique.mockResolvedValue(existingHuesped);
      mockPrisma.huesped.delete.mockResolvedValue({});

      await repository.delete("test-huesped-id");

      expect(mockPrisma.huesped.delete).toHaveBeenCalledWith({
        where: { id: "test-huesped-id" },
      });
    });

    it("should throw exception when huesped not found", async () => {
      mockPrisma.huesped.findUnique.mockResolvedValue(null);

      await expect(repository.delete("non-existent-id")).rejects.toThrow(HuespedException);
    });
  });
});
