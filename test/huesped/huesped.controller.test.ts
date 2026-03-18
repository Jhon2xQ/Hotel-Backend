import { describe, it, expect, vi, beforeEach } from "vitest";
import { HuespedController } from "../../src/presentation/controllers/huesped.controller";
import { CreateHuespedUseCase } from "../../src/application/use-cases/huesped/create-huesped.use-case";
import { ListHuespedUseCase } from "../../src/application/use-cases/huesped/list-huesped.use-case";
import { FindHuespedByIdUseCase } from "../../src/application/use-cases/huesped/find-huesped-by-id.use-case";
import { UpdateHuespedUseCase } from "../../src/application/use-cases/huesped/update-huesped.use-case";
import { DeleteHuespedUseCase } from "../../src/application/use-cases/huesped/delete-huesped.use-case";
import { createMockContext } from "../helpers/mock-context";
import { createMockHuesped } from "../helpers/huesped-fixtures";

describe("HuespedController", () => {
  let controller: HuespedController;
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

    controller = new HuespedController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create huesped and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        nombres: "Juan Carlos",
        apellidos: "Pérez García",
        email: "juan.perez@example.com",
        telefono: "+51987654321",
        nacionalidad: "Perú",
      };

      const mockHuesped = createMockHuesped();

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huésped creado exitosamente",
        }),
        201,
      );
    });

    it("should create huesped with nivel_vip", async () => {
      const mockContext = createMockContext();
      const input = {
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        nivel_vip: 2,
      };

      const mockHuesped = createMockHuesped({ nivelVip: 2 });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
        nivelVip: 2,
        notas: undefined,
      });
    });
  });

  describe("list", () => {
    it("should list all huespedes and return 200", async () => {
      const mockContext = createMockContext();
      const mockHuespedes = [createMockHuesped({ id: "huesped-1" }), createMockHuesped({ id: "huesped-2" })];

      mockListUseCase.execute.mockResolvedValue(mockHuespedes);

      await controller.list(mockContext);

      expect(mockListUseCase.execute).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huéspedes obtenidos exitosamente",
        }),
        200,
      );
    });

    it("should return empty array when no huespedes exist", async () => {
      const mockContext = createMockContext();

      mockListUseCase.execute.mockResolvedValue([]);

      await controller.list(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [],
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find huesped by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue("test-huesped-id");

      const mockHuesped = createMockHuesped({ id: "test-huesped-id" });

      mockFindByIdUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("test-huesped-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huésped encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update huesped and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue("test-huesped-id");

      const input = {
        telefono: "+51999999999",
        nivel_vip: 1,
      };

      const mockHuesped = createMockHuesped({
        telefono: "+51999999999",
        nivelVip: 1,
      });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-huesped-id", {
        nombres: undefined,
        apellidos: undefined,
        email: undefined,
        telefono: "+51999999999",
        nacionalidad: undefined,
        nivelVip: 1,
        notas: undefined,
      });
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huésped actualizado exitosamente",
        }),
        200,
      );
    });

    it("should update multiple fields", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue("test-huesped-id");

      const input = {
        telefono: "+51988888888",
        nivel_vip: 2,
        notas: "Cliente VIP actualizado",
      };

      const mockHuesped = createMockHuesped({
        telefono: "+51988888888",
        nivelVip: 2,
        notas: "Cliente VIP actualizado",
      });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-huesped-id", {
        nombres: undefined,
        apellidos: undefined,
        email: undefined,
        telefono: "+51988888888",
        nacionalidad: undefined,
        nivelVip: 2,
        notas: "Cliente VIP actualizado",
      });
    });
  });

  describe("delete", () => {
    it("should delete huesped and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue("test-huesped-id");

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-huesped-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huésped eliminado exitosamente",
        }),
        200,
      );
    });
  });
});
