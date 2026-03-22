import { describe, it, expect, beforeEach } from "vitest";
import { UpdatePagoUseCase } from "../../../src/application/use-cases/pago/update-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { IPersonalRepository } from "../../../src/domain/interfaces/personal.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago, createMockPersonal } from "../../helpers/pago-fixtures";
import { EstadoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("UpdatePagoUseCase", () => {
  let useCase: UpdatePagoUseCase;
  let mockRepository: IPagoRepository;
  let mockPersonalRepository: IPersonalRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => createMockPago(),
      update: async () => createMockPago(),
      delete: async () => {},
    };

    mockPersonalRepository = {
      findById: async () => null,
    };

    useCase = new UpdatePagoUseCase(mockRepository, mockPersonalRepository);
  });

  it("should update pago successfully", async () => {
    const existingPago = createMockPago({ id: "pago-123" });
    const updatedPago = createMockPago({ id: "pago-123", estado: EstadoPago.DEVUELTO });
    mockRepository.findById = async (id: string) => {
      if (id === "pago-123") return existingPago;
      return null;
    };
    mockRepository.update = async () => updatedPago;

    const result = await useCase.execute("pago-123", {
      estado: EstadoPago.DEVUELTO,
    });

    expect(result).toBeDefined();
    expect(result.estado).toBe("DEVUELTO");
  });

  it("should throw error if pago not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        estado: EstadoPago.DEVUELTO,
      }),
    ).rejects.toThrow(PagoException);
  });

  it("should throw error if monto is zero or negative", async () => {
    const existingPago = createMockPago();
    mockRepository.findById = async () => existingPago;

    await expect(
      useCase.execute("pago-123", {
        monto: 0,
      }),
    ).rejects.toThrow(PagoException);

    await expect(
      useCase.execute("pago-123", {
        monto: -100,
      }),
    ).rejects.toThrow(PagoException);
  });

  it("should update pago with new personal", async () => {
    const existingPago = createMockPago();
    const mockPersonal = createMockPersonal({ id: "personal-456" });
    const updatedPago = createMockPago({ recibidoPorId: "personal-456" });
    mockRepository.findById = async () => existingPago;
    mockRepository.update = async () => updatedPago;
    mockPersonalRepository.findById = async (id: string) => {
      if (id === "personal-456") return mockPersonal;
      return null;
    };

    const result = await useCase.execute("pago-123", {
      recibido_por_id: "personal-456",
    });

    expect(result.recibido_por_id).toBe("personal-456");
  });

  it("should throw error if personal does not exist", async () => {
    const existingPago = createMockPago();
    mockRepository.findById = async () => existingPago;
    mockPersonalRepository.findById = async () => null;

    await expect(
      useCase.execute("pago-123", {
        recibido_por_id: "non-existent-personal",
      }),
    ).rejects.toThrow(PagoException);
  });

  it("should update multiple fields at once", async () => {
    const existingPago = createMockPago();
    const updatedPago = createMockPago({
      estado: EstadoPago.DEVUELTO,
      metodo: MetodoPago.VISA,
      observacion: "Pago actualizado",
    });
    mockRepository.findById = async () => existingPago;
    mockRepository.update = async () => updatedPago;

    const result = await useCase.execute("pago-123", {
      estado: EstadoPago.DEVUELTO,
      metodo: MetodoPago.VISA,
      observacion: "Pago actualizado",
    });

    expect(result.estado).toBe("DEVUELTO");
    expect(result.metodo).toBe("VISA");
    expect(result.observacion).toBe("Pago actualizado");
  });
});
