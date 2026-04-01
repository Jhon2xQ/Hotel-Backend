import { describe, it, expect, vi, beforeEach } from "vitest";
import { TipoHabitacionController } from "../../src/presentation/controllers/tipo-habitacion.controller";
import { CreateTipoHabitacionUseCase } from "../../src/application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ListTipoHabitacionUseCase } from "../../src/application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { ListPublicTipoHabitacionUseCase } from "../../src/application/use-cases/tipo-habitacion/list-public-tipo-habitacion.use-case";
import { FindTipoHabitacionByIdUseCase } from "../../src/application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { UpdateTipoHabitacionUseCase } from "../../src/application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { DeleteTipoHabitacionUseCase } from "../../src/application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";
import { createMockContext } from "../helpers/mock-context";

describe("TipoHabitacionController", () => {
  let controller: TipoHabitacionController;
  let mockCreateUseCase: any;
  let mockListUseCase: any;
  let mockListPublicUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockDeleteUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListUseCase = { execute: vi.fn() };
    mockListPublicUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };

    controller = new TipoHabitacionController(
      mockCreateUseCase,
      mockListUseCase,
      mockListPublicUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create tipo habitacion and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tiene_ducha: true,
        tiene_banio: true,
      };

      const mockOutput = {
        id: "test-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tiene_ducha: true,
        tiene_banio: true,
        muebles: [],
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
          message: "Tipo de habitación creado exitosamente",
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list all tipos habitacion and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = [
        {
          id: "id-1",
          nombre: "Suite Deluxe",
          descripcion: "Suite de lujo",
          tiene_ducha: true,
          tiene_banio: true,
          muebles: [],
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
          message: "Tipos de habitación obtenidos exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find tipo habitacion by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const mockOutput = {
        id: "test-id",
        nombre: "Suite Deluxe",
        descripcion: "Suite de lujo",
        tiene_ducha: true,
        tiene_banio: true,
        muebles: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Tipo de habitación encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update tipo habitacion and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        nombre: "Suite Premium",
      };

      const mockOutput = {
        id: "test-id",
        nombre: "Suite Premium",
        descripcion: "Suite de lujo",
        tiene_ducha: true,
        tiene_banio: true,
        muebles: [],
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
          message: "Tipo de habitación actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete tipo habitacion and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Tipo de habitación eliminado exitosamente",
        }),
        200,
      );
    });
  });
});
