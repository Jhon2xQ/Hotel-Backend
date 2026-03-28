import { describe, it, expect, vi, beforeEach } from "vitest";
import { HabitacionController } from "../../src/presentation/controllers/habitacion.controller";
import { CreateHabitacionUseCase } from "../../src/application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../../src/application/use-cases/habitacion/list-habitacion.use-case";
import { FindHabitacionByIdUseCase } from "../../src/application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { UpdateHabitacionUseCase } from "../../src/application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../../src/application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../../src/application/use-cases/habitacion/delete-habitacion.use-case";
import { SearchAvailableHabitacionesUseCase } from "../../src/application/use-cases/habitacion/search-available-habitaciones.use-case";
import { createMockContext } from "../helpers/mock-context";
import { EstadoHabitacion } from "../../src/domain/entities/habitacion.entity";

describe("HabitacionController", () => {
  let controller: HabitacionController;
  let mockCreateUseCase: any;
  let mockListUseCase: any;
  let mockFindByIdUseCase: any;
  let mockUpdateUseCase: any;
  let mockUpdateStatusUseCase: any;
  let mockDeleteUseCase: any;
  let mockSearchAvailableUseCase: any;
  let mockFindByIdWithPriceUseCase: any;

  beforeEach(() => {
    mockCreateUseCase = { execute: vi.fn() };
    mockListUseCase = { execute: vi.fn() };
    mockFindByIdUseCase = { execute: vi.fn() };
    mockUpdateUseCase = { execute: vi.fn() };
    mockUpdateStatusUseCase = { execute: vi.fn() };
    mockDeleteUseCase = { execute: vi.fn() };
    mockSearchAvailableUseCase = { execute: vi.fn() };
    mockFindByIdWithPriceUseCase = { execute: vi.fn() };

    controller = new HabitacionController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockUpdateStatusUseCase,
      mockDeleteUseCase,
      mockSearchAvailableUseCase,
      mockFindByIdWithPriceUseCase,
    );
  });

  describe("create", () => {
    it("should create habitacion and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        nro_habitacion: "301",
        tipo_habitacion_id: "tipo-id",
        piso: 3,
      };

      const mockOutput = {
        id: "test-id",
        nro_habitacion: "301",
        tipo_habitacion_id: "tipo-id",
        tipo: { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
        piso: 3,
        tiene_ducha: false,
        tiene_banio: false,
        url_imagen: null,
        estado: "DISPONIBLE",
        notas: null,
        ulti_limpieza: null,
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
          message: "Habitación creada exitosamente",
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list all habitaciones and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = [
        {
          id: "id-1",
          nro_habitacion: "301",
          tipo_habitacion_id: "tipo-id",
          tipo: { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
          piso: 3,
          tiene_ducha: false,
          tiene_banio: false,
          url_imagen: null,
          estado: "DISPONIBLE",
          notas: null,
          ulti_limpieza: null,
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
          message: "Habitaciones obtenidas exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find habitacion by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const mockOutput = {
        id: "test-id",
        nro_habitacion: "301",
        tipo_id: "tipo-id",
        tipo: { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
        piso: 3,
        url_imagen: null,
        estado: "DISPONIBLE",
        limpieza: "LIMPIA",
        notas: null,
        ultima_limpieza: null,
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
          message: "Habitación encontrada",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update habitacion and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        nro_habitacion: "302",
        notas: "Notas actualizadas",
      };

      const mockOutput = {
        id: "test-id",
        nro_habitacion: "302",
        tipo_habitacion_id: "tipo-id",
        tipo: { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
        piso: 3,
        tiene_ducha: false,
        tiene_banio: false,
        url_imagen: null,
        estado: "DISPONIBLE",
        notas: "Notas actualizadas",
        ulti_limpieza: null,
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
          message: "Habitación actualizada exitosamente",
        }),
        200,
      );
    });
  });

  describe("updateStatus", () => {
    it("should update habitacion status and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      const input = {
        estado: EstadoHabitacion.OCUPADA,
      };

      const mockOutput = {
        id: "test-id",
        nro_habitacion: "301",
        tipo_habitacion_id: "tipo-id",
        tipo: { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
        piso: 3,
        tiene_ducha: false,
        tiene_banio: false,
        url_imagen: null,
        estado: "OCUPADA",
        notas: null,
        ulti_limpieza: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateStatusUseCase.execute.mockResolvedValue(mockOutput);

      await controller.updateStatus(mockContext);

      expect(mockUpdateStatusUseCase.execute).toHaveBeenCalledWith("test-id", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Estado de habitación actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete habitacion and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-id" });

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Habitación eliminada exitosamente",
        }),
        200,
      );
    });
  });
});
