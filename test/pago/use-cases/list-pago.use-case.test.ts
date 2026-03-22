import { describe, it, expect, beforeEach } from "vitest";
import { ListPagoUseCase } from "../../../src/application/use-cases/pago/list-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { createMockPago } from "../../helpers/pago-fixtures";
import { ConceptoPago, MetodoPago } from "../../../src/domain/entities/pago.entity";

describe("ListPagoUseCase", () => {
  let useCase: ListPagoUseCase;
  let mockRepository: IPagoRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockPago(),
      delete: async () => {},
    };

    useCase = new ListPagoUseCase(mockRepository);
  });

  it("should return empty array when no pagos exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should return all pagos", async () => {
    const mockPagos = [
      createMockPago({ id: "pago-1", concepto: ConceptoPago.RESERVA }),
      createMockPago({ id: "pago-2", concepto: ConceptoPago.CONSUMO }),
      createMockPago({ id: "pago-3", metodo: MetodoPago.VISA }),
    ];
    mockRepository.findAll = async () => mockPagos;

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("pago-1");
    expect(result[1].id).toBe("pago-2");
    expect(result[2].id).toBe("pago-3");
  });

  it("should return pagos with correct output format", async () => {
    const mockPagos = [createMockPago()];
    mockRepository.findAll = async () => mockPagos;

    const result = await useCase.execute();

    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("concepto");
    expect(result[0]).toHaveProperty("estado");
    expect(result[0]).toHaveProperty("fecha_pago");
    expect(result[0]).toHaveProperty("monto");
    expect(result[0]).toHaveProperty("moneda");
    expect(result[0]).toHaveProperty("metodo");
    expect(result[0]).toHaveProperty("recibido_por_id");
    expect(result[0]).toHaveProperty("recibido_por");
    expect(result[0]).toHaveProperty("observacion");
    expect(result[0]).toHaveProperty("created_at");
  });
});
