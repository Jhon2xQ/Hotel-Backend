import { describe, it, expect, vi, beforeEach } from "vitest";
import { FolioController } from "../../src/presentation/controllers/folio.controller";
import { createMockContext } from "../helpers/mock-context";

describe("FolioController", () => {
  let controller: FolioController;
  let mockCreateUseCase: any;
  let mockListPaginatedUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;
  let mockAddProductoUseCase: any;
  let mockAddServicioUseCase: any;
  let mockGetConsumosUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListPaginatedUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };
    mockAddProductoUseCase = { execute: vi.fn() };
    mockAddServicioUseCase = { execute: vi.fn() };
    mockGetConsumosUseCase = { execute: vi.fn() };

    controller = new FolioController(
      mockCreateUseCase,
      mockListPaginatedUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockAddProductoUseCase,
      mockAddServicioUseCase,
      mockGetConsumosUseCase,
    );
  });

  describe("create", () => {
    it("should create folio and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        reservaId: "estancia-123",
        observacion: "Folio de prueba",
        promocionIds: ["promo-1", "promo-2"],
      };

      const mockOutput = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        reservaId: "estancia-123",
        pagoId: null,
        estado: true,
        observacion: "Folio de prueba",
        cerradoEn: null,
        promociones: ["PROMO-VERANO", "PROMO-DESCUENTO"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        reservaId: "estancia-123",
      };

      const mockOutput = {
        id: "folio-1",
        codigo: "FOL-260416-1",
        reservaId: "estancia-123",
        pagoId: null,
        estado: true,
        observacion: null,
        cerradoEn: null,
        promociones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      const mockResult = {
        list: [
          { id: "folio-1", codigo: "FOL-260416-1", estado: true, promociones: ["PROMO-1"], reservaId: "estancia-1", pagoId: null, observacion: null, cerradoEn: null, createdAt: "", updatedAt: "" },
          { id: "folio-2", codigo: "FOL-260416-2", estado: false, promociones: [], reservaId: "estancia-1", pagoId: null, observacion: null, cerradoEn: null, createdAt: "", updatedAt: "" },
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      };

      mockContext.get = vi.fn().mockReturnValue(undefined);
      mockListPaginatedUseCase.execute.mockResolvedValue(mockResult);

      await controller.listPaginated(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith(undefined);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Folios obtenidos exitosamente",
        }),
        200,
      );
    });

    it("should list folios with pagination and filters", async () => {
      const mockContext = createMockContext();
      const queryData = { page: 2, limit: 5, reservaId: "estancia-1", estado: true };
      const mockResult = {
        list: [],
        pagination: { page: 2, limit: 5, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: true },
      };

      mockContext.get = vi.fn().mockReturnValue(queryData);
      mockListPaginatedUseCase.execute.mockResolvedValue(mockResult);

      await controller.listPaginated(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith(queryData);
    });
  });

  describe("findById", () => {
    it("should find folio by id and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = {
        id: "folio-123",
        codigo: "FOL-260416-5",
        reservaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: "Folio de prueba",
        cerradoEn: null,
        promociones: ["PROMO-VERANO"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-123" });
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
        codigo: "FOL-260416-1",
        reservaId: "estancia-1",
        pagoId: null,
        estado: false,
        observacion: "Observación actualizada",
        cerradoEn: new Date().toISOString(),
        promociones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-1" });
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
        codigo: "FOL-260416-1",
        reservaId: "estancia-1",
        pagoId: null,
        estado: true,
        observacion: null,
        cerradoEn: null,
        promociones: ["PROMO-NUEVA-1", "PROMO-NUEVA-2"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-1" });
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

      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-to-delete" });
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

  describe("addProducto", () => {
    it("should add producto to folio and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        productoId: "producto-1",
        cantidad: 2,
        precioUnit: 10,
      };

      const mockOutput = {
        id: "folio-producto-1",
        folioId: "folio-1",
        productoId: "producto-1",
        cantidad: 2,
        precioUnit: 10,
        total: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-1" });
      mockAddProductoUseCase.execute.mockResolvedValue(mockOutput);

      await controller.addProducto(mockContext);

      expect(mockAddProductoUseCase.execute).toHaveBeenCalledWith("folio-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Producto agregado al folio",
          data: mockOutput,
        }),
        201,
      );
    });
  });

  describe("addServicio", () => {
    it("should add servicio to folio and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        concepto: "Masaje",
        cantidad: 1,
        precioUnit: 50,
      };

      const mockOutput = {
        id: "folio-servicio-1",
        folioId: "folio-1",
        concepto: "Masaje",
        cantidad: 1,
        precioUnit: 50,
        total: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-1" });
      mockAddServicioUseCase.execute.mockResolvedValue(mockOutput);

      await controller.addServicio(mockContext);

      expect(mockAddServicioUseCase.execute).toHaveBeenCalledWith("folio-1", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Servicio agregado al folio",
          data: mockOutput,
        }),
        201,
      );
    });
  });

  describe("getConsumos", () => {
    it("should get consumos and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = {
        folio: {
          id: "folio-1",
          codigo: "FOL-260416-1",
          reservaId: "estancia-1",
          pagoId: null,
          estado: true,
          observacion: null,
          cerradoEn: null,
          promociones: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        productos: [
          {
            id: "fp-1",
            folioId: "folio-1",
            productoId: "producto-1",
            cantidad: 2,
            precioUnit: 10,
            total: 20,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        servicios: [
          {
            id: "fs-1",
            folioId: "folio-1",
            concepto: "Masaje",
            cantidad: 1,
            precioUnit: 50,
            total: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 70,
      };

      mockContext.req.param = vi.fn().mockReturnValue({ id: "folio-1" });
      mockGetConsumosUseCase.execute.mockResolvedValue(mockOutput);

      await controller.getConsumos(mockContext);

      expect(mockGetConsumosUseCase.execute).toHaveBeenCalledWith("folio-1");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Consumos obtenidos",
          data: mockOutput,
        }),
        200,
      );
    });
  });
});
