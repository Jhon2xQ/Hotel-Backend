import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateHabitationUseCase } from "../../../src/application/use-cases/habitation/update-habitation.use-case";
import { IHabitationRepository } from "../../../src/domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../src/domain/exceptions/habitation.exception";
import { Habitation, HabitationType, HabitationStatus } from "../../../src/domain/entities/habitation.entity";

describe("UpdateHabitationUseCase", () => {
  let useCase: UpdateHabitationUseCase;
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
    useCase = new UpdateHabitationUseCase(mockRepository);
  });

  it("should update habitation successfully", async () => {
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

    const updatedHabitation = new Habitation(
      "test-id",
      "101",
      2,
      HabitationType.Suite,
      200,
      HabitationStatus.Mantenimiento,
      new Date(),
      new Date(),
    );

    const input = {
      numero: "101",
      piso: 2,
      tipo: HabitationType.Suite,
      precio: 200,
      estado: HabitationStatus.Mantenimiento,
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitation);
    (mockRepository.update as any).mockResolvedValue(updatedHabitation);

    const result = await useCase.execute("test-id", input);

    expect(result.piso).toBe(2);
    expect(result.tipo).toBe(HabitationType.Suite);
    expect(result.estado).toBe(HabitationStatus.Mantenimiento);
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.update).toHaveBeenCalledWith("test-id", input);
  });

  it("should update only status when partial update", async () => {
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

    const updatedHabitation = new Habitation(
      "test-id",
      "101",
      1,
      HabitationType.EstandarSimple,
      100,
      HabitationStatus.Ocupado,
      new Date(),
      new Date(),
    );

    const input = {
      estado: HabitationStatus.Ocupado,
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitation);
    (mockRepository.update as any).mockResolvedValue(updatedHabitation);

    const result = await useCase.execute("test-id", input);

    expect(result.estado).toBe(HabitationStatus.Ocupado);
    expect(result.numero).toBe("101");
    expect(result.piso).toBe(1);
    expect(mockRepository.update).toHaveBeenCalledWith("test-id", input);
  });

  it("should throw exception when habitation not found", async () => {
    const input = {
      numero: "101",
      piso: 2,
      tipo: HabitationType.Suite,
      estado: HabitationStatus.Disponible,
    };

    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id", input)).rejects.toThrow(HabitationException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw exception when numero already exists", async () => {
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

    const duplicateHabitation = new Habitation(
      "other-id",
      "102",
      2,
      HabitationType.Suite,
      200,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );

    const input = {
      numero: "102",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
      estado: HabitationStatus.Disponible,
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitation);
    (mockRepository.findByNumero as any).mockResolvedValue(duplicateHabitation);

    await expect(useCase.execute("test-id", input)).rejects.toThrow(HabitationException);
    expect(mockRepository.findByNumero).toHaveBeenCalledWith("102");
  });

  it("should not check numero conflict when numero is not being updated", async () => {
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

    const updatedHabitation = new Habitation(
      "test-id",
      "101",
      2,
      HabitationType.Suite,
      200,
      HabitationStatus.Disponible,
      new Date(),
      new Date(),
    );

    const input = {
      piso: 2,
      tipo: HabitationType.Suite,
      precio: 200,
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitation);
    (mockRepository.update as any).mockResolvedValue(updatedHabitation);

    await useCase.execute("test-id", input);

    expect(mockRepository.findByNumero).not.toHaveBeenCalled();
  });
});
