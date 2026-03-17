import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindHabitationByIdUseCase } from "../../../src/application/use-cases/habitation/find-habitation-by-id.use-case";
import { IHabitationRepository } from "../../../src/domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../src/domain/exceptions/habitation.exception";
import { Habitation, HabitationType, HabitationStatus } from "../../../src/domain/entities/habitation.entity";

describe("FindHabitationByIdUseCase", () => {
  let useCase: FindHabitationByIdUseCase;
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
    useCase = new FindHabitationByIdUseCase(mockRepository);
  });

  it("should find habitation by id successfully", async () => {
    const mockHabitation = new Habitation(
      "test-id",
      "101",
      1,
      HabitationType.EstandarSimple,
      100,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(mockHabitation);

    const result = await useCase.execute("test-id");

    expect(result.id).toBe("test-id");
    expect(result.numero).toBe("101");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when habitation not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitationException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
