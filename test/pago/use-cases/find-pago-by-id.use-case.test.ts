import { describe, it, expect, beforeEach } from "vitest";
import { FindPagoByIdUseCase } from "../../../src/application/use-cases/pago/find-pago-by-id.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago } from "../../helpers/pago-fixtures";

describe("FindPagoByIdUseCase", () => {
  let useCase: FindPagoByIdUseCase;
  let mockRepository: IPagoRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockPago(),
      delete: async () => {},
    };

    useCase = new FindPagoByIdUseCase(mockRepository);
  });

  it("should find pago by id successfully", async () => {
    const mockPago = createMockPago({ id: "pago-123" });
    mockRepository.findById = async (id: string) => {
      if (id === "pago-123") return mockPago;
      return null;
    };

    const result = await useCase.execute("pago-123");

    expect(result).toBeDefined();
    expect(result.id).toBe("pago-123");
  });

  it("should throw error if pago not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(PagoException);
  });

  it("should return pago with correct output format", async () => {
    const mockPago = createMockPago();
    mockRepository.findById = async () => mockPago;

    const result = await useCase.execute("pago-123");

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("concepto");
    expect(result).toHaveProperty("estado");
    expect(result).toHaveProperty("fecha_pago");
    expect(result).toHaveProperty("monto");
    expect(result).toHaveProperty("moneda");
    expect(result).toHaveProperty("metodo");
    expect(result).toHaveProperty("recibido_por");
    expect(result).toHaveProperty("created_at");
  });
});
