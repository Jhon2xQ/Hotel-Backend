import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteHuespedUseCase } from "../../../src/application/use-cases/huesped/delete-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("DeleteHuespedUseCase", () => {
  let useCase: DeleteHuespedUseCase;
  let mockRepository: IHuespedRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHuesped(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockHuesped(),
      delete: vi.fn(),
    };

    useCase = new DeleteHuespedUseCase(mockRepository);
  });

  it("should delete huesped successfully", async () => {
    await useCase.execute("test-huesped-id");

    expect(mockRepository.delete).toHaveBeenCalledWith("test-huesped-id");
  });
});
