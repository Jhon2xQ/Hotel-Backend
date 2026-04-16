import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductoController } from "../../src/presentation/controllers/producto.controller";
import { CreateProductoUseCase } from "../../src/application/use-cases/producto/create-producto.use-case";
import { ListProductoPaginatedUseCase } from "../../src/application/use-cases/producto/list-producto-paginated.use-case";
import { FindProductoByIdUseCase } from "../../src/application/use-cases/producto/find-producto-by-id.use-case";
import { UpdateProductoUseCase } from "../../src/application/use-cases/producto/update-producto.use-case";
import { DeleteProductoUseCase } from "../../src/application/use-cases/producto/delete-producto.use-case";
import { createMockContext } from "../helpers/mock-context";

describe("ProductoController", () => {
  let controller: ProductoController;
  let mockCreateUseCase: any;
  let mockListPaginatedUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListPaginatedUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };

    controller = new ProductoController(
      mockCreateUseCase,
      mockListPaginatedUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create producto and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia de 355ml",
        precio_unitario: 5.5,
        stock: 100,
      };

      const mockOutput = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia de 355ml",
        precio_unitario: 5.5,
        stock: 100,
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
          message: "Producto creado exitosamente",
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list productos paginated and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.query = vi.fn().mockReturnValue({ page: "1", limit: "10" });

      const mockOutput = {
        list: [
          {
            id: "id-1",
            codigo: "PROD-001",
            nombre: "Cerveza Cristal",
            descripcion: "Cerveza rubia",
            precio_unitario: 5.5,
            stock: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false },
      };

      mockListPaginatedUseCase.execute.mockResolvedValue(mockOutput);

      await controller.list(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Productos obtenidos exitosamente",
        }),
        200,
      );
    });

    it("should use default pagination values", async () => {
      const mockContext = createMockContext();
      mockContext.req.query = vi.fn().mockReturnValue({});

      mockListPaginatedUseCase.execute.mockResolvedValue({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } });

      await controller.list(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe("findById", () => {
    it("should find producto by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const mockOutput = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Cristal",
        descripcion: "Cerveza rubia",
        precio_unitario: 5.5,
        stock: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Producto encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update producto and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        nombre: "Cerveza Heineken",
        precio_unitario: 7.0,
      };

      const mockOutput = {
        id: "test-id",
        codigo: "PROD-001",
        nombre: "Cerveza Heineken",
        descripcion: "Cerveza rubia",
        precio_unitario: 7.0,
        stock: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-id", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Producto actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete producto and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Producto eliminado exitosamente",
        }),
        200,
      );
    });
  });
});