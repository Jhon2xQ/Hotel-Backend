import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateHabitationUseCase } from "../../../src/application/use-cases/create-habitation.use-case";
import { IHabitationRepository } from "../../../src/domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../src/domain/exceptions/habitation.exception";
import { Habitation, HabitationType, HabitationStatus } from "../../../src/domain/entities/habitation.entity";

describe("CreateHabitationUseCase", () => {
  let useCase: CreateHabitationUseCase;
  let mockRepository: IHabitationRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findByNumero: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateHabitationUseCase(mockRepository);
  });

  it("should create a habitation successfully", async () => {
    const input = {
      numero: "101",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
      precio: 100,
    };

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

    (mockRepository.findByNumero as any).mockResolvedValue(null);
    (mockRepository.create as any).mockResolvedValue(mockHabitation);

    const result = await useCase.execute(input);

    expect(result.numero).toBe("101");
    expect(mockRepository.findByNumero).toHaveBeenCalledWith("101");
    expect(mockRepository.create).toHaveBeenCalledWith(input);
  });

  it("should throw exception when numero already exists", async () => {
    const input = {
      numero: "101",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
    };

    const existingHabitation = new Habitation(
      "existing-id",
      "101",
      1,
      HabitationType.EstandarSimple,
      100,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );

    (mockRepository.findByNumero as any).mockResolvedValue(existingHabitation);

    await expect(useCase.execute(input)).rejects.toThrow(HabitationException);
  });
});
