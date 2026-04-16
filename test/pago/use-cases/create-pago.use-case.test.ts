import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreatePagoUseCase } from "../../../src/application/use-cases/pago/create-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { IUserRepository } from "../../../src/domain/interfaces/user.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago, createMockUser } from "../../helpers/pago-fixtures";
import { ConceptoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("CreatePagoUseCase", () => {
  let useCase: CreatePagoUseCase;
  let mockPagoRepository: IPagoRepository;
  let mockFolioRepository: IFolioRepository;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockPagoRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => null,
      findByReservaId: async () => null,
      findByFolioId: async () => null,
      update: async () => createMockPago(),
      delete: async () => {},
    };

    mockFolioRepository = {
      create: async () => ({ id: "folio-1" } as any),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByEstanciaId: async () => [],
      findByCodigo: async () => null,
      findOpenByEstanciaId: async () => null,
      update: async () => ({ id: "folio-1" } as any),
      delete: async () => {},
      addProducto: async () => ({ id: "fp-1" } as any),
      addServicio: async () => ({ id: "fs-1" } as any),
      getConsumos: async () => ({ productos: [], servicios: [] }),
      getTotal: async () => 100,
      closeWithPago: vi.fn().mockResolvedValue({ id: "folio-1", estado: false }),
    };

    mockUserRepository = {
      findById: async () => null,
    };

    useCase = new CreatePagoUseCase(mockPagoRepository, mockFolioRepository, mockUserRepository);
  });

  it("should create a pago successfully", async () => {
    const mockPago = createMockPago();
    mockPagoRepository.create = async () => mockPago;

    const result = await useCase.execute({
      concepto: ConceptoPago.RESERVA,
      monto: 150.0,
      metodo: MetodoPago.EFECTIVO,
    });

    expect(result).toBeDefined();
    expect(result.concepto).toBe("RESERVA");
    expect(result.monto).toBe("150");
    expect(result.metodo).toBe("EFECTIVO");
  });

  it("should throw error if monto is zero or negative", async () => {
    await expect(
      useCase.execute({
        concepto: ConceptoPago.RESERVA,
        monto: 0,
        metodo: MetodoPago.EFECTIVO,
      }),
    ).rejects.toThrow(PagoException);

    await expect(
      useCase.execute({
        concepto: ConceptoPago.RESERVA,
        monto: -50,
        metodo: MetodoPago.EFECTIVO,
      }),
    ).rejects.toThrow(PagoException);
  });

  it("should create pago with recibido_por_id", async () => {
    const mockUser = createMockUser({ id: "user-123" });
    const mockPago = createMockPago({ recibidoPorId: "user-123" });
    mockPagoRepository.create = async () => mockPago;
    mockUserRepository.findById = async (id: string) => {
      if (id === "user-123") return mockUser;
      return null;
    };

    const result = await useCase.execute({
      concepto: ConceptoPago.RESERVA,
      monto: 150.0,
      metodo: MetodoPago.EFECTIVO,
      recibido_por_id: "user-123",
    });

    expect(result.recibido_por_id).toBe("user-123");
    expect(result.recibido_por).toBeDefined();
  });

  it("should throw error if user does not exist", async () => {
    mockUserRepository.findById = async () => null;

    await expect(
      useCase.execute({
        concepto: ConceptoPago.RESERVA,
        monto: 150.0,
        metodo: MetodoPago.EFECTIVO,
        recibido_por_id: "non-existent-user",
      }),
    ).rejects.toThrow(PagoException);
  });

  it("should create pago for folio and close it", async () => {
    const mockPago = createMockPago({ id: "pago-1" });
    const mockFolio = {
      id: "folio-1",
      estado: true,
    };

    mockFolioRepository.findById = async () => mockFolio as any;
    mockFolioRepository.getTotal = async () => 100;
    mockPagoRepository.create = async () => mockPago;

    let closeCalledWith: any = null;
    mockFolioRepository.closeWithPago = async (folioId: string, pagoId: string) => {
      closeCalledWith = { folioId, pagoId };
      return { ...mockFolio, estado: false } as any;
    };

    const result = await useCase.execute({
      concepto: ConceptoPago.CONSUMO,
      monto: 100,
      metodo: MetodoPago.EFECTIVO,
      folioId: "folio-1",
    });

    expect(result).toBeDefined();
    expect(closeCalledWith).toEqual({ folioId: "folio-1", pagoId: "pago-1" });
  });

  it("should throw error if folio not found", async () => {
    mockFolioRepository.findById = async () => null;

    await expect(
      useCase.execute({
        concepto: ConceptoPago.CONSUMO,
        monto: 100,
        metodo: MetodoPago.EFECTIVO,
        folioId: "non-existent-folio",
      }),
    ).rejects.toThrow();
  });

  it("should throw error if folio is already closed", async () => {
    const closedFolio = {
      id: "folio-1",
      estado: false,
    };

    mockFolioRepository.findById = async () => closedFolio as any;

    await expect(
      useCase.execute({
        concepto: ConceptoPago.CONSUMO,
        monto: 100,
        metodo: MetodoPago.EFECTIVO,
        folioId: "folio-1",
      }),
    ).rejects.toThrow();
  });
});
