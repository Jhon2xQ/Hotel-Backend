import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListHabitationsUseCase } from "../../../src/application/use-cases/habitation/list-habitations.use-case";
import { IHabitationRepository } from "../../../src/domain/interfaces/habitation.repository.interface";
import { Habitation, HabitationType, HabitationStatus } from "../../../src/domain/entities/habitation.entity";

describe("ListHabitationsUseCase", () => {
  let useCase: ListHabitationsUseCase;
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
    useCase = new ListHabitationsUseCase(mockRepository);
  });

  it("should return all habitations", async () => {
    const mockHabitations = [
      new Habitation(
        "id-1",
        "101",
        1,
        HabitationType.EstandarSimple,
        100,
        HabitationStatus.Disponible,
        new Date(),
        new Date(),
      ),
      new Habitation(
        "id-2",
        "102",
        1,
        HabitationType.EstandarDoble,
        150,
        HabitationStatus.Ocupado,
        new Date(),
        new Date(),
      ),
    ];

    (mockRepository.findAll as any).mockResolvedValue(mockHabitations);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].numero).toBe("101");
    expect(result[1].numero).toBe("102");
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no habitations exist", async () => {
    (mockRepository.findAll as any).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
