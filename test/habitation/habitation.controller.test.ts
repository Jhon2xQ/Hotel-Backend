import { describe, it, expect, vi, beforeEach } from "vitest";
import { HabitationController } from "../../src/presentation/controllers/habitation.controller";
import { createMockContext } from "../helpers/mock-context";
import { HabitationType } from "../../src/domain/entities/habitation.entity";

describe("HabitationController", () => {
  let controller: HabitationController;
  let mockUseCases: any;

  beforeEach(() => {
    mockUseCases = {
      create: { execute: vi.fn() },
      list: { execute: vi.fn() },
      findById: { execute: vi.fn() },
      update: { execute: vi.fn() },
      delete: { execute: vi.fn() },
    };

    controller = new HabitationController(
      mockUseCases.create,
      mockUseCases.list,
      mockUseCases.findById,
      mockUseCases.update,
      mockUseCases.delete,
    );
  });

  it("should create a habitation", async () => {
    const mockContext = createMockContext();
    mockContext.get = vi.fn().mockReturnValue({
      numero: "101",
      piso: 1,
      tipo: HabitationType.EstandarSimple,
    });

    const mockOutput = {
      id: "test-id",
      numero: "101",
      piso: 1,
      tipo: "ESTÁNDAR SIMPLE",
      precio: null,
      estado: "Disponible",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockUseCases.create.execute.mockResolvedValue(mockOutput);

    await controller.create(mockContext);

    expect(mockUseCases.create.execute).toHaveBeenCalled();
    expect(mockContext.json).toHaveBeenCalled();
  });
});
