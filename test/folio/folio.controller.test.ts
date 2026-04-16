import { describe, it, expect, vi, beforeEach } from "vitest";
import { FolioController } from "../../src/presentation/controllers/folio.controller";
import { createMockContext } from "../helpers/mock-context";

describe("FolioController", () => {
  let controller: FolioController;
  let mockCreateUseCase: any;
  let mockListUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;
  let mockCloseUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };
    mockCloseUseCase = { execute: vi.fn() };

    controller = new FolioController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockCloseUseCase,
    );
  });

  describe("create", () => {
    it("should create folio and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        reservaId: "reserva-123",
        observacion: "Folio de prueba",
        promocionIds: ["promo-1", "promo-2"],
      };

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-123",
        estado: true,
        observacion: "Folio de prueba",
        cerrado_en: null,
        promociones: ["PROMO-VERANO", "PROMO-DESCUENTO"],
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
          message: "Folio creado exitosamente",
          data: mockOutput,
        }),
        201,
      );
    });

    it("should create folio without promociones", async () => {
      const mockContext = createMockContext();
      const input = {
        reservaId: "reserva-123",
      };

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-123",
        estado: true,
        observacion: null,
        cerrado_en: null,
        promociones: [],
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
    it("should list all folios and return 200", async () => {
      const mockContext = createMockContext();
      const mockResult = [
        { id: "folio-1", nro_folio: 1, estado: true, promociones: ["PROMO-1"] },
        { id: "folio-2", nro_folio: 2, estado: false, promociones: [] },
      ];

      mockListUseCase.execute.mockResolvedValue(mockResult);

      await controller.list(mockContext);

      expect(mockListUseCase.execute).toHaveBeenCalledWith();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folios obtenidos exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find folio by id and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = {
        id: "folio-123",
        nro_folio: 5,
        reserva_id: "reserva-1",
        estado: true,
        observacion: "Folio de prueba",
        cerrado_en: null,
        promociones: ["PROMO-VERANO"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.req.param = vi.fn().mockReturnValue("folio-123");
      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("folio-123");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update folio and return 200", async () => {
      const mockContext = createMockContext();
      const input = {
        estado: false,
        observacion: "Observación actualizada",
      };

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-1",
        estado: false,
        observacion: "Observación actualizada",
        cerrado_en: new Date().toISOString(),
        promociones: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("folio-1");
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("folio-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio actualizado exitosamente",
        }),
        200,
      );
    });

    it("should update only promociones", async () => {
      const mockContext = createMockContext();
      const input = {
        promocionIds: ["promo-nueva-1", "promo-nueva-2"],
      };

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-1",
        estado: true,
        observacion: null,
        cerrado_en: null,
        promociones: ["PROMO-NUEVA-1", "PROMO-NUEVA-2"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("folio-1");
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("folio-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete folio and return 200", async () => {
      const mockContext = createMockContext();

      mockContext.req.param = vi.fn().mockReturnValue("folio-to-delete");
      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("folio-to-delete");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio eliminado exitosamente",
        }),
        200,
      );
    });
  });

  describe("close", () => {
    it("should close folio and return 200", async () => {
      const mockContext = createMockContext();
      const input = {
        observacion: "Cierre de folio por checkout",
      };

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-1",
        estado: false,
        observacion: "Cierre de folio por checkout",
        cerrado_en: new Date().toISOString(),
        promociones: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("folio-1");
      mockCloseUseCase.execute.mockResolvedValue(mockOutput);

      await controller.close(mockContext);

      expect(mockCloseUseCase.execute).toHaveBeenCalledWith("folio-1", input.observacion);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio cerrado exitosamente",
        }),
        200,
      );
    });

    it("should close folio without observacion", async () => {
      const mockContext = createMockContext();
      const input = {};

      const mockOutput = {
        id: "folio-1",
        nro_folio: 1,
        reserva_id: "reserva-1",
        estado: false,
        observacion: null,
        cerrado_en: new Date().toISOString(),
        promociones: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue("folio-1");
      mockCloseUseCase.execute.mockResolvedValue(mockOutput);

      await controller.close(mockContext);

      expect(mockCloseUseCase.execute).toHaveBeenCalledWith("folio-1", undefined);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folio cerrado exitosamente",
        }),
        200,
      );
    });
  });
});