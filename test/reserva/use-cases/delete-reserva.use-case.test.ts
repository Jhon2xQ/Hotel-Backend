import { describe, it, expect, beforeEach } from "vitest";
import { DeleteReservaUseCase } from "../../../src/application/use-cases/reserva/delete-reserva.use-case";
import { IReservaRepository } from "../../../src/domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../src/domain/exceptions/reserva.exception";
import { createMockReserva } from "../../helpers/reserva-fixtures";

describe("DeleteReservaUseCase", () => {
  let useCase: DeleteReservaUseCase;
  let mockRepository: IReservaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async (data) => createMockReserva(),
      findAll: async () => [],
      findById: async (id) => null,
      findByCodigo: async (codigo) => null,
      update: async (id, data) => createMockReserva(),
      delete: async (id) => {},
      cancel: async (id, motivo) => createMockReserva(),
    } as any;

    useCase = new DeleteReservaUseCase(mockRepository);
  });

  it("debe eliminar una reserva exitosamente", async () => {
    let deleted = false;
    mockRepository.delete = async (id) => {
      deleted = true;
    };

    await useCase.execute("reserva-test-id");

    expect(deleted).toBe(true);
  });

  it("debe propagar errores del repositorio", async () => {
    mockRepository.delete = async () => {
      throw ReservaException.notFoundById();
    };

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(ReservaException);
  });
});
