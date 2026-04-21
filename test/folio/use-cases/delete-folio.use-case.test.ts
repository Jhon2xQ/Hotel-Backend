import { describe, it, expect, beforeEach } from "vitest";
import { DeleteFolioUseCase } from "../../../src/application/use-cases/folio/delete-folio.use-case";
import { IFolioRepository } from "../../../src/domain/interfaces/folio.repository.interface";
import { FolioException } from "../../../src/domain/exceptions/folio.exception";
import { createMockFolio } from "../../helpers/folio-fixtures";

describe("DeleteFolioUseCase", () => {
  let useCase: DeleteFolioUseCase;
  let mockRepository: IFolioRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFolio(),
      findAll: async () => [],
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findById: async () => null,
      findByReservaId: async () => [],
      findByCodigo: async () => null,
      update: async () => createMockFolio(),
      delete: async () => {},
      addProducto: async () => ({ id: "fp-1" } as any),
      addServicio: async () => ({ id: "fs-1" } as any),
      getConsumos: async () => ({ productos: [], servicios: [] }),
      getTotal: async () => 0,
      closeWithPago: async () => createMockFolio(),
    };

    useCase = new DeleteFolioUseCase(mockRepository);
  });

  it("should delete folio successfully", async () => {
    const openFolio = createMockFolio({ id: "folio-1", estado: true, pagoId: null });
    mockRepository.findById = async () => openFolio;
    mockRepository.delete = async () => {};

    await expect(useCase.execute("folio-1")).resolves.not.toThrow();
  });

  it("should throw error when folio not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent")).rejects.toThrow(FolioException);
  });

  it("should throw error when trying to delete a closed folio", async () => {
    const closedFolio = createMockFolio({ id: "folio-1", estado: false });
    mockRepository.findById = async () => closedFolio;

    await expect(useCase.execute("folio-1")).rejects.toThrow(FolioException);
  });

  it("should throw error when trying to delete a folio with pago", async () => {
    const folioWithPago = createMockFolio({ id: "folio-1", estado: true, pagoId: "pago-1" });
    mockRepository.findById = async () => folioWithPago;

    await expect(useCase.execute("folio-1")).rejects.toThrow(FolioException);
  });
});
