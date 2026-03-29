import { describe, it, expect, vi, beforeEach } from "vitest";
import { MuebleController } from "../../src/presentation/controllers/mueble.controller";
import { CreateMuebleUseCase } from "../../src/application/use-cases/mueble/create-mueble.use-case";
import { ListMueblesUseCase } from "../../src/application/use-cases/mueble/list-mueble.use-case";
import { FindMuebleByIdUseCase } from "../../src/application/use-cases/mueble/find-mueble-by-id.use-case";
import { UpdateMuebleUseCase } from "../../src/application/use-cases/mueble/update-mueble.use-case";
import { DeleteMuebleUseCase } from "../../src/application/use-cases/mueble/delete-mueble.use-case";
import { createMockContext } from "../helpers/mock-context";
import { MuebleCondition } from "../../src/domain/entities/mueble.entity";

describe("MuebleController", () => {
  let controller: MuebleController;
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

    controller = new MuebleController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create mueble and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        categoria_id: "categoria-id",
        habitacion_id: "habitacion-id",
      };

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        descripcion: null,
        categoria: { id: "categoria-id", nombre: "Cama", descripcion: "Muebles para dormir", activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        url_imagen: null,
        condicion: "BUENO",
        fecha_adquisicion: null,
        ultima_revision: null,
        habitacion_id: "habitacion-id",
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
    it("should list all muebles and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = [
        {
          id: "id-1",
          codigo: "CAMA-001",
          nombre: "Cama King Size",
          descripcion: null,
          categoria: { id: "categoria-id", nombre: "Cama", descripcion: "Muebles para dormir", activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          url_imagen: null,
          condicion: "BUENO",
          fecha_adquisicion: null,
          ultima_revision: null,
          habitacion_id: "habitacion-id",
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
    it("should find mueble by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        descripcion: "Cama de lujo",
        categoria: { id: "categoria-id", nombre: "Cama", descripcion: "Muebles para dormir", activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        url_imagen: "https://example.com/cama.jpg",
        condicion: "BUENO",
        fecha_adquisicion: "2025-01-15",
        ultima_revision: "2026-03-01",
        habitacion_id: "habitacion-id",
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
    it("should update mueble and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        nombre: "Cama Queen Size",
        condicion: MuebleCondition.Regular,
      };

      const mockOutput = {
        id: "test-id",
        codigo: "CAMA-001",
        nombre: "Cama Queen Size",
        descripcion: null,
        categoria: { id: "categoria-id", nombre: "Cama", descripcion: "Muebles para dormir", activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        url_imagen: null,
        condicion: "REGULAR",
        fecha_adquisicion: null,
        ultima_revision: null,
        habitacion_id: "habitacion-id",
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
    it("should delete mueble and return 200", async () => {
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
