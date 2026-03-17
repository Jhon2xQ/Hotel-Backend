import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteHabitationUseCase } from "../../../src/application/use-cases/habitation/delete-habitation.use-case";
import { IHabitationRepository } from "../../../src/domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../src/domain/exceptions/habitation.exception";
import { Habitation, HabitationType, HabitationStatus } from "../../../src/domain/entities/habitation.entity";

describe("DeleteHabitationUseCase", () => {
  let useCase: DeleteHabitationUseCase;
  let mockRepository: IHabitationRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findByNumero: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteHabitationUseCase(mockRepository);
  });

  it("should delete habitation successfully", async () => {
    const existingHabitation = new Habitation(
      "test-id",
      "101",
      1,
      HabitationType.EstandarSimple,
      100,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(existingHabitation);
    (mockRepository.delete as any).mockResolvedValue(undefined);

    await useCase.execute("test-id");

    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.delete).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when habitation not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitationException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
