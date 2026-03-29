import { describe, it, expect, beforeEach, vi } from "vitest";
import { HuespedRepository } from "../../src/infrastructure/repositories/huesped.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { HuespedException } from "../../src/domain/exceptions/huesped.exception";

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
      count: vi.fn(),
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
        tipoDoc: null,
        nroDoc: null,
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        observacion: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.nombres).toBe("Juan Carlos");
      expect(result.apellidos).toBe("Pérez García");
      expect(result.email).toBe("juan.perez@example.com");
      expect(mockPrisma.huesped.create).toHaveBeenCalled();
    });

    it("should create huesped with all fields", async () => {
      const input = {
        tipo_doc: "DNI" as const,
        nro_doc: "12345678",
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        observacion: "Cliente VIP",
      };

      const mockResult = {
        id: "test-huesped-id",
        tipoDoc: "DNI",
        nroDoc: "12345678",
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        observacion: "Cliente VIP",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.huesped.create.mockResolvedValue(mockResult);

      const result = await repository.create(input);

      expect(result.tipo_doc).toBe("DNI");
      expect(result.nro_doc).toBe("12345678");
      expect(result.observacion).toBe("Cliente VIP");
    });
  });

  describe("findAll", () => {
    it("should return all huespedes ordered by createdAt DESC", async () => {
      const mockResults = [
        {
          id: "huesped-1",
          tipoDoc: null,
          nroDoc: null,
          nombres: "Juan",
          apellidos: "Pérez",
          email: "juan@example.com",
          telefono: "+51987654321",
          nacionalidad: "Perú",
          observacion: null,
          createdAt: new Date("2026-03-18T14:30:00.000Z"),
          updatedAt: new Date("2026-03-18T14:30:00.000Z"),
        },
        {
          id: "huesped-2",
          tipoDoc: null,
          nroDoc: null,
          nombres: "María",
          apellidos: "García",
          email: "maria@example.com",
          telefono: "+51912345678",
          nacionalidad: "Argentina",
          observacion: null,
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

  describe("findAllPaginated", () => {
    it("should return paginated results without name filter", async () => {
      const mockResults = [
        {
          id: "huesped-1",
          tipoDoc: null,
          nroDoc: null,
          nombres: "Juan",
          apellidos: "Pérez",
          email: "juan@example.com",
          telefono: "+51987654321",
          nacionalidad: "Perú",
          observacion: null,
          createdAt: new Date("2026-03-18T14:30:00.000Z"),
          updatedAt: new Date("2026-03-18T14:30:00.000Z"),
        },
      ];

      mockPrisma.huesped.findMany.mockResolvedValue(mockResults);
      mockPrisma.huesped.count.mockResolvedValue(1);

      const result = await repository.findAllPaginated({ page: 1, limit: 10 });

      expect(result.list).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(mockPrisma.huesped.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: undefined,
          take: 10,
          skip: 0,
          orderBy: { createdAt: "desc" },
        }),
      );
      expect(mockPrisma.huesped.count).toHaveBeenCalledWith({ where: undefined });
    });

    it("should filter by name using case-insensitive contains on nombres and apellidos", async () => {
      mockPrisma.huesped.findMany.mockResolvedValue([]);
      mockPrisma.huesped.count.mockResolvedValue(0);

      await repository.findAllPaginated({ page: 1, limit: 10, name: "Juan" });

      expect(mockPrisma.huesped.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { nombres: { contains: "Juan", mode: "insensitive" } },
              { apellidos: { contains: "Juan", mode: "insensitive" } },
            ],
          },
          take: 10,
          skip: 0,
        }),
      );
      expect(mockPrisma.huesped.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { nombres: { contains: "Juan", mode: "insensitive" } },
            { apellidos: { contains: "Juan", mode: "insensitive" } },
          ],
        },
      });
    });
  });

  describe("findById", () => {
    it("should find huesped by id", async () => {
      const mockResult = {
        id: "test-huesped-id",
        tipoDoc: null,
        nroDoc: null,
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        observacion: null,
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
        observacion: "Actualizado",
      };

      const existingHuesped = {
        id: "test-huesped-id",
        tipoDoc: null,
        nroDoc: null,
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
        observacion: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResult = {
        ...existingHuesped,
        telefono: "+51999999999",
        observacion: "Actualizado",
        updatedAt: new Date(),
      };

      mockPrisma.huesped.update.mockResolvedValue(mockResult);

      const result = await repository.update("test-huesped-id", updateData);

      expect(result.telefono).toBe("+51999999999");
      expect(result.observacion).toBe("Actualizado");
      expect(mockPrisma.huesped.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete huesped", async () => {
      mockPrisma.huesped.delete.mockResolvedValue({});

      await repository.delete("test-huesped-id");

      expect(mockPrisma.huesped.delete).toHaveBeenCalledWith({
        where: { id: "test-huesped-id" },
      });
    });
  });
});
