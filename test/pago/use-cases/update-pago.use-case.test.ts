import { describe, it, expect, beforeEach } from "vitest";
import { UpdatePagoUseCase } from "../../../src/application/use-cases/pago/update-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago } from "../../helpers/pago-fixtures";
import { EstadoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("UpdatePagoUseCase", () => {
  let useCase: UpdatePagoUseCase;
  let mockRepository: IPagoRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => createMockPago(),
      update: async () => createMockPago(),
      delete: async () => {},
    };

    useCase = new UpdatePagoUseCase(mockRepository);
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
