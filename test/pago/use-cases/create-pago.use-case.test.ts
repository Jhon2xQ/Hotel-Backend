import { describe, it, expect, beforeEach } from "vitest";
import { CreatePagoUseCase } from "../../../src/application/use-cases/pago/create-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { IUserRepository } from "../../../src/domain/interfaces/user.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago, createMockUser } from "../../helpers/pago-fixtures";
import { ConceptoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("CreatePagoUseCase", () => {
  let useCase: CreatePagoUseCase;
  let mockRepository: IPagoRepository;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockPago(),
      delete: async () => {},
    };

    mockUserRepository = {
      findById: async () => null,
    };

    useCase = new CreatePagoUseCase(mockRepository, mockUserRepository);
  });

  it("should create a pago successfully", async () => {
    const mockPago = createMockPago();
    mockRepository.create = async () => mockPago;

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
    mockRepository.create = async () => mockPago;
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

  it("should create pago with custom fecha_pago", async () => {
    const customDate = new Date("2026-03-20T10:00:00.000Z");
    const mockPago = createMockPago({ fechaPago: customDate });
    mockRepository.create = async () => mockPago;

    const result = await useCase.execute({
      concepto: ConceptoPago.CONSUMO,
      monto: 200.0,
      metodo: MetodoPago.VISA,
      fecha_pago: customDate,
    });

    expect(result.fecha_pago).toBe(customDate.toISOString());
  });

  it("should create pago with all optional fields", async () => {
    const mockUser = createMockUser();
    const mockPago = createMockPago({
      concepto: ConceptoPago.CONSUMO,
      monto: 300.0,
      moneda: "PEN",
      metodo: MetodoPago.TRANSFERENCIA,
      observacion: "Pago por servicios adicionales",
    });
    mockRepository.create = async () => mockPago;
    mockUserRepository.findById = async () => mockUser;

    const result = await useCase.execute({
      concepto: ConceptoPago.CONSUMO,
      monto: 300.0,
      moneda: "PEN",
      metodo: MetodoPago.TRANSFERENCIA,
      recibido_por_id: "user-123",
      observacion: "Pago por servicios adicionales",
    });

    expect(result.moneda).toBe("PEN");
    expect(result.observacion).toBe("Pago por servicios adicionales");
  });
});
