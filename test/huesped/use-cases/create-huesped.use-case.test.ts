import { describe, it, expect, beforeEach } from "vitest";
import { CreateHuespedUseCase } from "../../../src/application/use-cases/huesped/create-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../src/domain/exceptions/huesped.exception";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("CreateHuespedUseCase", () => {
  let useCase: CreateHuespedUseCase;
  let mockRepository: IHuespedRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHuesped(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockHuesped(),
      delete: async () => {},
    };

    useCase = new CreateHuespedUseCase(mockRepository);
  });

  it("should create a huesped successfully", async () => {
    const mockHuesped = createMockHuesped();
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      email: "juan.perez@example.com",
      telefono: "+51987654321",
      nacionalidad: "Perú",
    });

    expect(result).toBeDefined();
    expect(result.nombres).toBe("Juan Carlos");
    expect(result.apellidos).toBe("Pérez García");
    expect(result.email).toBe("juan.perez@example.com");
  });

  it("should create huesped with nivel_vip", async () => {
    const mockHuesped = createMockHuesped({ nivelVip: 2 });
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      nombres: "María Elena",
      apellidos: "Rodríguez López",
      email: "maria.rodriguez@example.com",
      telefono: "+51912345678",
      nacionalidad: "Argentina",
      nivelVip: 2,
    });

    expect(result.nivelVip).toBe(2);
  });

  it("should throw error if nivel_vip is less than 0", async () => {
    await expect(
      useCase.execute({
        nombres: "Test",
        apellidos: "User",
        email: "test@example.com",
        telefono: "+51999999999",
        nacionalidad: "Perú",
        nivelVip: -1,
      }),
    ).rejects.toThrow(HuespedException);
  });

  it("should throw error if nivel_vip is greater than 2", async () => {
    await expect(
      useCase.execute({
        nombres: "Test",
        apellidos: "User",
        email: "test@example.com",
        telefono: "+51999999999",
        nacionalidad: "Perú",
        nivelVip: 3,
      }),
    ).rejects.toThrow(HuespedException);
  });

  it("should create huesped with notas", async () => {
    const mockHuesped = createMockHuesped({ notas: "Cliente frecuente" });
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      nombres: "Pedro",
      apellidos: "González",
      email: "pedro.gonzalez@example.com",
      telefono: "+51988888888",
      nacionalidad: "Chile",
      notas: "Cliente frecuente",
    });

    expect(result.notas).toBe("Cliente frecuente");
  });

  it("should create huesped with default nivel_vip 0", async () => {
    const mockHuesped = createMockHuesped({ nivelVip: 0 });
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      nombres: "Ana",
      apellidos: "Martínez",
      email: "ana.martinez@example.com",
      telefono: "+51977777777",
      nacionalidad: "Colombia",
    });

    expect(result.nivelVip).toBe(0);
  });
});
