import { describe, it, expect, vi, beforeEach } from "vitest";
import { FurnitureCatalogController } from "../../src/presentation/controllers/furniture-catalog.controller";
import { CreateFurnitureCatalogUseCase } from "../../src/application/use-cases/furniture-catalog/create-furniture-catalog.use-case";
import { ListFurnitureCatalogsUseCase } from "../../src/application/use-cases/furniture-catalog/list-furniture-catalogs.use-case";
import { FindFurnitureCatalogByIdUseCase } from "../../src/application/use-cases/furniture-catalog/find-furniture-catalog-by-id.use-case";
import { UpdateFurnitureCatalogUseCase } from "../../src/application/use-cases/furniture-catalog/update-furniture-catalog.use-case";
import { DeleteFurnitureCatalogUseCase } from "../../src/application/use-cases/furniture-catalog/delete-furniture-catalog.use-case";
import { createMockContext } from "../helpers/mock-context";
import { FurnitureCategory } from "../../src/domain/entities/furniture-catalog.entity";

describe("FurnitureCatalogController", () => {
  let controller: FurnitureCatalogController;
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

    controller = new FurnitureCatalogController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create furniture catalog and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: FurnitureCategory.Cama,
        descripcion: "Descripción",
      };

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: "CAMA",
        descripcion: "Descripción",
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
          message: "Mueble creado exitosamente",
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list all furniture catalogs and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = [
        {
          id: "id-1",
          codigo: "CAMA-KING-01",
          nombre: "Cama King Size",
          categoria: "CAMA",
          descripcion: "Descripción 1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockListUseCase.execute.mockResolvedValue(mockOutput);

      await controller.list(mockContext);

      expect(mockListUseCase.execute).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Muebles obtenidos exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find furniture catalog by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size",
        categoria: "CAMA",
        descripcion: "Descripción",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Mueble encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update furniture catalog and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        nombre: "Cama King Size Premium",
      };

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-KING-01",
        nombre: "Cama King Size Premium",
        categoria: "CAMA",
        descripcion: "Descripción",
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
          message: "Mueble actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete furniture catalog and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Mueble eliminado exitosamente",
        }),
        200,
      );
    });
  });
});
