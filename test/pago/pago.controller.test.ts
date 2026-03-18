import { describe, it, expect, vi, beforeEach } from "vitest";
import { PagoController } from "../../src/presentation/controllers/pago.controller";
import { CreatePagoUseCase } from "../../src/application/use-cases/pago/create-pago.use-case";
import { ListPagoUseCase } from "../../src/application/use-cases/pago/list-pago.use-case";
import { FindPagoByIdUseCase } from "../../src/application/use-cases/pago/find-pago-by-id.use-case";
import { UpdatePagoUseCase } from "../../src/application/use-cases/pago/update-pago.use-case";
import { DeletePagoUseCase } from "../../src/application/use-cases/pago/delete-pago.use-case";
import { createMockContext } from "../helpers/mock-context";
import { ConceptoPago, MetodoPago, EstadoPago } from "../../src/domain/entities/pago.entity";

describe("PagoController", () => {
  let controller: PagoController;
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

    controller = new PagoController(
      mockCreateUseCase,
      mockListUseCase,
      mockFindByIdUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
    );
  });

  describe("create", () => {
    it("should create pago and return 201", async () => {
      const mockContext = createMockContext();
      const input = {
        concepto: ConceptoPago.RESERVA,
        monto: 150.0,
        metodo: MetodoPago.EFECTIVO,
      };

      const mockOutput = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fecha_pago: new Date().toISOString(),
        monto: "150.00",
        moneda: "USD",
        metodo: "EFECTIVO",
        recibido_por_id: null,
        recibido_por: null,
        notas: null,
        created_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockCreateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.create(mockContext);

      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Pago creado exitosamente",
        }),
        201,
      );
    });
  });

  describe("list", () => {
    it("should list all pagos and return 200", async () => {
      const mockContext = createMockContext();
      const mockOutput = [
        {
          id: "pago-1",
          concepto: "RESERVA",
          estado: "CONFIRMADO",
          fecha_pago: new Date().toISOString(),
          monto: "150.00",
          moneda: "USD",
          metodo: "EFECTIVO",
          recibido_por_id: null,
          recibido_por: null,
          notas: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockListUseCase.execute.mockResolvedValue(mockOutput);

      await controller.list(mockContext);

      expect(mockListUseCase.execute).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Pagos obtenidos exitosamente",
        }),
        200,
      );
    });
  });

  describe("findById", () => {
    it("should find pago by id and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-pago-id" });

      const mockOutput = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "CONFIRMADO",
        fecha_pago: new Date().toISOString(),
        monto: "150.00",
        moneda: "USD",
        metodo: "EFECTIVO",
        recibido_por_id: null,
        recibido_por: null,
        notas: null,
        created_at: new Date().toISOString(),
      };

      mockFindByIdUseCase.execute.mockResolvedValue(mockOutput);

      await controller.findById(mockContext);

      expect(mockFindByIdUseCase.execute).toHaveBeenCalledWith("test-pago-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Pago encontrado",
        }),
        200,
      );
    });
  });

  describe("update", () => {
    it("should update pago and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-pago-id" });

      const input = {
        estado: EstadoPago.APLICADO,
        notas: "Pago aplicado al folio",
      };

      const mockOutput = {
        id: "test-pago-id",
        concepto: "RESERVA",
        estado: "APLICADO",
        fecha_pago: new Date().toISOString(),
        monto: "150.00",
        moneda: "USD",
        metodo: "EFECTIVO",
        recibido_por_id: null,
        recibido_por: null,
        notas: "Pago aplicado al folio",
        created_at: new Date().toISOString(),
      };

      mockContext.get = vi.fn().mockReturnValue(input);
      mockUpdateUseCase.execute.mockResolvedValue(mockOutput);

      await controller.update(mockContext);

      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith("test-pago-id", input);
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Pago actualizado exitosamente",
        }),
        200,
      );
    });
  });

  describe("delete", () => {
    it("should delete pago and return 200", async () => {
      const mockContext = createMockContext();
      mockContext.req.param = vi.fn().mockReturnValue({ id: "test-pago-id" });

      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(mockContext);

      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith("test-pago-id");
      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Pago eliminado exitosamente",
        }),
        200,
      );
    });
  });
});
