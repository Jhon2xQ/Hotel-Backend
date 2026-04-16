import { describe, it, expect, beforeEach, vi } from "vitest";
import { FolioRepository } from "../../src/infrastructure/repositories/folio.repository";
import { createMockPrismaClient } from "../helpers/mock-prisma";
import { Prisma } from "../../generated/prisma/client";

describe("FolioRepository", () => {
  let repository: FolioRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();

    mockPrisma.folio = {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    repository = new FolioRepository(mockPrisma);
  });

  describe("create", () => {
    it("should create a folio without promociones", async () => {
      const mockResult = {
        id: "folio-1",
        nroFolio: 1,
        reservaId: "reserva-1",
        estado: true,
        observacion: null,
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        reservaId: "reserva-1",
      });

      expect(result.reservaId).toBe("reserva-1");
      expect(result.nroFolio).toBe(1);
      expect(result.estado).toBe(true);
      expect(result.promociones).toEqual([]);
      expect(mockPrisma.folio.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reservaId: "reserva-1",
          estado: true,
          observacion: null,
        }),
        include: { promociones: { select: { codigo: true } } },
      });
    });

    it("should create a folio with promociones", async () => {
      const mockResult = {
        id: "folio-2",
        nroFolio: 2,
        reservaId: "reserva-2",
        estado: true,
        observacion: "Folio con promociones",
        cerradoEn: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [{ codigo: "PROMO-VERANO" }, { codigo: "PROMO-DESCUENTO" }],
      };

      mockPrisma.folio.create.mockResolvedValue(mockResult);

      const result = await repository.create({
        reservaId: "reserva-2",
        observacion: "Folio con promociones",
        promocionIds: ["promo-1", "promo-2"],
      });

      expect(result.reservaId).toBe("reserva-2");
      expect(result.promociones).toEqual(["PROMO-VERANO", "PROMO-DESCUENTO"]);
      expect(mockPrisma.folio.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reservaId: "reserva-2",
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
          nroFolio: 1,
          reservaId: "reserva-1",
          estado: true,
          observacion: null,
          cerradoEn: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [{ codigo: "PROMO-1" }],
        },
        {
          id: "folio-2",
          nroFolio: 2,
          reservaId: "reserva-2",
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
      expect(result[0].nroFolio).toBe(1);
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
        nroFolio: 5,
        reservaId: "reserva-1",
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
      expect(result?.nroFolio).toBe(5);
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

  describe("findByReservaId", () => {
    it("should return folios for a specific reserva", async () => {
      const mockResults = [
        {
          id: "folio-1",
          nroFolio: 1,
          reservaId: "reserva-1",
          estado: true,
          observacion: null,
          cerradoEn: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [],
        },
        {
          id: "folio-2",
          nroFolio: 2,
          reservaId: "reserva-1",
          estado: false,
          observacion: "Cerrado",
          cerradoEn: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          promociones: [{ codigo: "PROMO-1" }],
        },
      ];

      mockPrisma.folio.findMany.mockResolvedValue(mockResults);

      const result = await repository.findByReservaId("reserva-1");

      expect(result.length).toBe(2);
      expect(result[0].nroFolio).toBe(1);
      expect(result[1].nroFolio).toBe(2);
      expect(mockPrisma.folio.findMany).toHaveBeenCalledWith({
        where: { reservaId: "reserva-1" },
        include: { promociones: { select: { codigo: true } } },
        orderBy: { nroFolio: "asc" },
      });
    });
  });

  describe("update", () => {
    it("should update folio fields", async () => {
      const mockResult = {
        id: "folio-1",
        nroFolio: 1,
        reservaId: "reserva-1",
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

    it("should update estado to false (close folio)", async () => {
      const mockResult = {
        id: "folio-1",
        nroFolio: 1,
        reservaId: "reserva-1",
        estado: false,
        observacion: null,
        cerradoEn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.update.mockResolvedValue(mockResult);

      const result = await repository.update("folio-1", {
        estado: false,
      });

      expect(result.estado).toBe(false);
      expect(result.cerradoEn).toBeDefined();
    });

    it("should update promociones with set operation", async () => {
      const mockResult = {
        id: "folio-1",
        nroFolio: 1,
        reservaId: "reserva-1",
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

  describe("close", () => {
    it("should close folio and set cerradoEn timestamp", async () => {
      const closedAt = new Date();
      vi.useFakeTimers();
      vi.setSystemTime(closedAt);

      const mockResult = {
        id: "folio-1",
        nroFolio: 1,
        reservaId: "reserva-1",
        estado: false,
        observacion: null,
        cerradoEn: closedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        promociones: [],
      };

      mockPrisma.folio.update.mockResolvedValue(mockResult);

      const result = await repository.close("folio-1");

      expect(result.estado).toBe(false);
      expect(result.cerradoEn).toEqual(closedAt);
      expect(mockPrisma.folio.update).toHaveBeenCalledWith({
        where: { id: "folio-1" },
        data: {
          estado: false,
          cerradoEn: closedAt,
        },
        include: { promociones: { select: { codigo: true } } },
      });

      vi.useRealTimers();
    });
  });
});