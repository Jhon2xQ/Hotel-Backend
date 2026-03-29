import { describe, it, expect, vi, beforeEach } from "vitest";
import { HuespedController } from "../../src/presentation/controllers/huesped.controller";
import { CreateHuespedUseCase } from "../../src/application/use-cases/huesped/create-huesped.use-case";
import { ListHuespedPaginatedUseCase } from "../../src/application/use-cases/huesped/list-huesped-paginated.use-case";
import { FindHuespedByIdUseCase } from "../../src/application/use-cases/huesped/find-huesped-by-id.use-case";
import { UpdateHuespedUseCase } from "../../src/application/use-cases/huesped/update-huesped.use-case";
import { DeleteHuespedUseCase } from "../../src/application/use-cases/huesped/delete-huesped.use-case";
import { createMockContext } from "../helpers/mock-context";
import { createMockHuesped } from "../helpers/huesped-fixtures";

describe("HuespedController", () => {
  let controller: HuespedController;
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

    controller = new HuespedController(
      mockCreateUseCase,
      mockListPaginatedUseCase,
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

    it("should create huesped with tipo_doc", async () => {
      const mockContext = createMockContext();
      const input = {
        tipo_doc: "PASAPORTE",
        nro_doc: "AB123456",
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        email: "maria.rodriguez@example.com",
        telefono: "+51912345678",
        nacionalidad: "Argentina",
      };

      const mockHuesped = createMockHuesped({ tipo_doc: "PASAPORTE", nro_doc: "AB123456" });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    });
  });

  describe("listPaginated", () => {
    it("should list paginated huespedes and return 200", async () => {
      const mockContext = createMockContext();
      const mockHuespedes = [createMockHuesped({ id: "huesped-1" }), createMockHuesped({ id: "huesped-2" })];

      const paginatedResult = {
        list: mockHuespedes,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockContext.get = vi.fn().mockReturnValue({ page: 1, limit: 10 });
      mockListPaginatedUseCase.execute.mockResolvedValue(paginatedResult);

      await controller.listPaginated(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Huéspedes obtenidos exitosamente",
          data: expect.objectContaining({
            pagination: expect.objectContaining({
              page: 1,
              limit: 10,
              total: 2,
            }),
          }),
        }),
        200,
      );
    });

    it("should pass name filter to use-case", async () => {
      const mockContext = createMockContext();

      const paginatedResult = {
        list: [createMockHuesped({ nombres: "Juan" })],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockContext.get = vi.fn().mockReturnValue({ page: 1, limit: 10, name: "Juan" });
      mockListPaginatedUseCase.execute.mockResolvedValue(paginatedResult);

      await controller.listPaginated(mockContext);

      expect(mockListPaginatedUseCase.execute).toHaveBeenCalledWith({ page: 1, limit: 10, name: "Juan" });
    });

    it("should return empty array when no huespedes exist", async () => {
      const mockContext = createMockContext();

      const paginatedResult = {
        list: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockContext.get = vi.fn().mockReturnValue({ page: 1, limit: 10 });
      mockListPaginatedUseCase.execute.mockResolvedValue(paginatedResult);

      await controller.listPaginated(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            list: [],
          }),
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
        observacion: "Actualizado",
      };

      const mockHuesped = createMockHuesped({
        telefono: "+51999999999",
        observacion: "Actualizado",
      });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-huesped-id", input);
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
        observacion: "Cliente VIP actualizado",
      };

      const mockHuesped = createMockHuesped({
        telefono: "+51988888888",
        observacion: "Cliente VIP actualizado",
      });

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockHuesped);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-huesped-id", input);
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
