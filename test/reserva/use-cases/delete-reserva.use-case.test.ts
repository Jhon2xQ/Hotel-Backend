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
      create: async (_data: any) => createMockReserva(),
      findAll: async () => [],
      findById: async (_id: string) => null,
      findByCodigo: async (_codigo: string) => null,
      findConflictingReservations: async () => [],
      update: async (_id: string, _data: any) => createMockReserva(),
      delete: async (_id: string) => {},
      cancel: async (_id: string, _motivo: string) => createMockReserva(),
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
