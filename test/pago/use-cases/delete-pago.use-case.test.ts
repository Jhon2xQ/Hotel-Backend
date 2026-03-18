import { describe, it, expect, beforeEach } from "vitest";
import { DeletePagoUseCase } from "../../../src/application/use-cases/pago/delete-pago.use-case";
import { IPagoRepository } from "../../../src/domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../src/domain/exceptions/pago.exception";
import { createMockPago } from "../../helpers/pago-fixtures";

describe("DeletePagoUseCase", () => {
  let useCase: DeletePagoUseCase;
  let mockRepository: IPagoRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockPago(),
      findAll: async () => [],
      findById: async () => createMockPago(),
      update: async () => createMockPago(),
      delete: async () => {},
    };

    useCase = new DeletePagoUseCase(mockRepository);
  });

  it("should delete pago successfully", async () => {
    const mockPago = createMockPago({ id: "pago-123" });
    mockRepository.findById = async (id: string) => {
      if (id === "pago-123") return mockPago;
      return null;
    };
    let deleted = false;
    mockRepository.delete = async () => {
      deleted = true;
    };

    await useCase.execute("pago-123");

    expect(deleted).toBe(true);
  });

  it("should throw error if pago not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(PagoException);
  });

  it("should not call delete if pago does not exist", async () => {
    mockRepository.findById = async () => null;
    let deleteCalled = false;
    mockRepository.delete = async () => {
      deleteCalled = true;
    };

    try {
      await useCase.execute("non-existent-id");
    } catch (error) {
      // Expected error
    }

    expect(deleteCalled).toBe(false);
  });
});
