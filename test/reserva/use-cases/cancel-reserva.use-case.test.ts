import { describe, it, expect, beforeEach } from "vitest";
import { CancelReservaUseCase } from "../../../src/application/use-cases/reserva/cancel-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";
import { CancelReservaInput } from "../../../src/application/dtos/reserva.dto";

describe("CancelReservaUseCase", () => {
  let useCase: CancelReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async (_data: any) => createMockReserva(),
      findAll: async () => [],
      findById: async (_id: string) => null,
      findByCodigo: async (_codigo: string) => null,
      update: async (_id: string, _data: any) => createMockReserva(),
      delete: async (_id: string) => {},
      cancel: async (_id: string, _motivo: string) => createMockReserva(),
    } as any;

    useCase = new CancelReservaUseCase(mockRepository);
  });

  it("debe cancelar una reserva exitosamente", async () => {
    const input: CancelReservaInput = {
      motivoCancel: "Cliente solicitó cancelación",
    };

    const mockReserva = createMockReserva({
      estado: "CANCELADA",
      motivoCancel: "Cliente solicitó cancelación",
      canceladoEn: new Date(),
    });
    mockRepository.cancel = async (id, motivo) => mockReserva;

    const result = await useCase.execute("reserva-test-id", input);

    expect(result.estado).toBe("CANCELADA");
    expect(result.motivoCancel).toBe("Cliente solicitó cancelación");
    expect(result.canceladoEn).toBeDefined();
  });

  it("debe lanzar error al cancelar reserva completada", async () => {
    const input: CancelReservaInput = {
      motivoCancel: "Cliente solicitó cancelación",
    };

    mockRepository.cancel = async () => {
      throw ReservaException.cannotCancelCompleted();
    };

    await expect(useCase.execute("reserva-test-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error al cancelar reserva ya cancelada", async () => {
    const input: CancelReservaInput = {
      motivoCancel: "Cliente solicitó cancelación",
    };

    mockRepository.cancel = async () => {
      throw ReservaException.alreadyCancelled();
    };

    await expect(useCase.execute("reserva-test-id", input)).rejects.toThrow(ReservaException);
  });

  it("debe lanzar error si no se proporciona motivo", async () => {
    const input: CancelReservaInput = {
      motivoCancel: "",
    };

    mockRepository.cancel = async () => {
      throw ReservaException.cancelRequiresMotivo();
    };

    await expect(useCase.execute("reserva-test-id", input)).rejects.toThrow(ReservaException);
  });
});
