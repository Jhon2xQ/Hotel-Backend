import { describe, it, expect, beforeEach } from "vitest";
import { ListMueblesUseCase } from "../../../src/application/use-cases/mueble/list-mueble.use-case";
import { IMuebleRepository } from "../../../src/domain/interfaces/mueble.repository.interface";
import { createMockMueble } from "../../helpers/mueble-fixtures";

describe("ListMueblesUseCase", () => {
  let useCase: ListMueblesUseCase;
  let mockMuebleRepo: IMuebleRepository;

  beforeEach(() => {
    mockMuebleRepo = {
      create: async () => createMockMueble(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockMueble(),
      delete: async () => {},
    };

    useCase = new ListMueblesUseCase(mockMuebleRepo);
  });

  it("should return all muebles", async () => {
    mockMuebleRepo.findAll = async () => [
      createMockMueble({ id: "id-1", codigo: "CAMA-001" }),
      createMockMueble({ id: "id-2", codigo: "MESA-001" }),
    ];

    const results = await useCase.execute();

    expect(results).toHaveLength(2);
    expect(results[0].codigo).toBe("CAMA-001");
    expect(results[1].codigo).toBe("MESA-001");
  });

  it("should return empty array when no muebles exist", async () => {
    mockMuebleRepo.findAll = async () => [];

    const results = await useCase.execute();

    expect(results).toHaveLength(0);
  });
});
