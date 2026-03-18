import { describe, it, expect, beforeEach } from "vitest";
import { CreatePagoUseCase } from "../../../src/application/use-cases/pago/create-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { IPersonalRepository } from "../../../src/domain/interfaces/personal.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago, createMockPersonal } from "../../helpers/pago-fixtures";
import { ConceptoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("CreatePagoUseCase", () => {
  let useCase: CreatePagoUseCase;
  let mockRepository: IPagoRepository;
  let mockPersonalRepository: IPersonalRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockPago(),
      delete: async () => {},
    };

    mockPersonalRepository = {
      findById: async () => null,
    };

    useCase = new CreatePagoUseCase(mockRepository, mockPersonalRepository);
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
    const mockPersonal = createMockPersonal({ id: "personal-123" });
    const mockPago = createMockPago({ recibidoPorId: "personal-123" });
    mockRepository.create = async () => mockPago;
    mockPersonalRepository.findById = async (id: string) => {
      if (id === "personal-123") return mockPersonal;
      return null;
    };

    const result = await useCase.execute({
      concepto: ConceptoPago.RESERVA,
      monto: 150.0,
      metodo: MetodoPago.EFECTIVO,
      recibido_por_id: "personal-123",
    });

    expect(result.recibido_por_id).toBe("personal-123");
    expect(result.recibido_por).toBeDefined();
  });

  it("should throw error if personal does not exist", async () => {
    mockPersonalRepository.findById = async () => null;

    await expect(
      useCase.execute({
        concepto: ConceptoPago.RESERVA,
        monto: 150.0,
        metodo: MetodoPago.EFECTIVO,
        recibido_por_id: "non-existent-personal",
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
    const mockPersonal = createMockPersonal();
    const mockPago = createMockPago({
      concepto: ConceptoPago.CONSUMO,
      monto: 300.0,
      moneda: "PEN",
      metodo: MetodoPago.TRANSFERENCIA,
      notas: "Pago por servicios adicionales",
    });
    mockRepository.create = async () => mockPago;
    mockPersonalRepository.findById = async () => mockPersonal;

    const result = await useCase.execute({
      concepto: ConceptoPago.CONSUMO,
      monto: 300.0,
      moneda: "PEN",
      metodo: MetodoPago.TRANSFERENCIA,
      recibido_por_id: "personal-123",
      notas: "Pago por servicios adicionales",
    });

    expect(result.moneda).toBe("PEN");
    expect(result.notas).toBe("Pago por servicios adicionales");
  });
});
