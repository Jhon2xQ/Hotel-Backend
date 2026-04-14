import { describe, it, expect, vi, beforeEach } from "vitest";
import { PromocionController } from "../../src/presentation/controllers/promocion.controller";
import { createMockContext } from "../helpers/mock-context";

describe("PromocionController", () => {
  let controller: PromocionController;
  let mockCreateUseCase: any;
  let mockListUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };

    controller = new PromocionController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create promocion and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "PROMO-VERANO",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 15.0,
        vig_desde: new Date("2026-06-01"),
        vig_hasta: new Date("2026-08-31"),
      };

      const mockOutput = {
        id: "promo-1",
        codigo: "PROMO-VERANO",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 15.0,
        vig_desde: "2026-06-01T00:00:00.000Z",
        vig_hasta: "2026-08-31T23:59:59.000Z",
        estado: true,
        habitaciones: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promoción creada exitosamente",
          data: mockOutput,
        }),
        201,
      );
    });

    it("should create promocion with habitaciones", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "PROMO-HAB",
        tipo_descuento: "MONTO_FIJO",
        valor_descuento: 50.0,
        vig_desde: new Date("2026-01-01"),
        vig_hasta: new Date("2026-12-31"),
        habitaciones: ["hab-1", "hab-2"],
      };

      const mockOutput = {
        id: "promo-2",
        codigo: "PROMO-HAB",
        tipo_descuento: "MONTO_FIJO",
        valor_descuento: 50.0,
        vig_desde: "2026-01-01T00:00:00.000Z",
        vig_hasta: "2026-12-31T23:59:59.000Z",
        estado: true,
        habitaciones: ["hab-1", "hab-2"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockOutput,
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list all promociones without pagination", async () => {
      const mockContext = createMockContext();
      const mockResult = [
        { id: "promo-1", codigo: "PROMO-1", habitaciones: ["hab-1"] },
        { id: "promo-2", codigo: "PROMO-2", habitaciones: [] },
      ];

      mockListUseCase.execute.mockResolvedValue(mockResult);

      await controller.list(mockContext);

      expect(mockListUseCase.execute).toHaveBeenCalledWith();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promociones obtenidas exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find promocion by id and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = {
        id: "promo-123",
        codigo: "PROMO-VERANO",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 15.0,
        vig_desde: "2026-06-01T00:00:00.000Z",
        vig_hasta: "2026-08-31T23:59:59.000Z",
        estado: true,
        habitaciones: ["hab-1", "hab-2"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.req.param = vi.fn().mockReturnValue("promo-123");
      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("promo-123");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promoción encontrada",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update promocion and return 200", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "PROMO-UPDATED",
        valor_descuento: 25.0,
      };

      const mockOutput = {
        id: "promo-1",
        codigo: "PROMO-UPDATED",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 25.0,
        vig_desde: "2026-06-01T00:00:00.000Z",
        vig_hasta: "2026-08-31T23:59:59.000Z",
        estado: true,
        habitaciones: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("promo-1");
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("promo-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promoción actualizada exitosamente",
        }),
        200,
      );
    });

    it("should update only habitaciones", async () => {
      const mockContext = createMockContext();
      const input = {
        habitaciones: ["hab-1", "hab-2", "hab-3"],
      };

      const mockOutput = {
        id: "promo-1",
        codigo: "PROMO-EXISTING",
        tipo_descuento: "PORCENTAJE",
        valor_descuento: 15.0,
        vig_desde: "2026-06-01T00:00:00.000Z",
        vig_hasta: "2026-08-31T23:59:59.000Z",
        estado: true,
        habitaciones: ["hab-1", "hab-2", "hab-3"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("promo-1");
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("promo-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promoción actualizada exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete promocion and return 200", async () => {
      const mockContext = createMockContext();

      mockContext.req.param = vi.fn().mockReturnValue("promo-to-delete");
      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("promo-to-delete");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Promoción eliminada exitosamente",
        }),
        200,
      );
    });
  });
});
