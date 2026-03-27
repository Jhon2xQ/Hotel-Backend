import { describe, it, expect, beforeEach } from "vitest";
import { CreateHuespedUseCase } from "../../../src/application/use-cases/huesped/create-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("CreateHuespedUseCase", () => {
  let useCase: CreateHuespedUseCase;
  let mockRepository: IHuespedRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHuesped(),
      findAll: async () => [],
      findById: async () => null,
      findByEmail: async () => null,
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

  it("should create huesped with tipo_doc and nro_doc", async () => {
    const mockHuesped = createMockHuesped({ tipo_doc: "DNI", nro_doc: "12345678" });
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      tipo_doc: "DNI",
      nro_doc: "12345678",
      nombres: "María Elena",
      apellidos: "Rodríguez López",
      email: "maria.rodriguez@example.com",
      telefono: "+51912345678",
      nacionalidad: "Argentina",
    });

    expect(result.tipo_doc).toBe("DNI");
    expect(result.nro_doc).toBe("12345678");
  });

  it("should create huesped with observacion", async () => {
    const mockHuesped = createMockHuesped({ observacion: "Cliente frecuente" });
    mockRepository.create = async () => mockHuesped;

    const result = await useCase.execute({
      nombres: "Pedro",
      apellidos: "González",
      email: "pedro.gonzalez@example.com",
      telefono: "+51988888888",
      nacionalidad: "Chile",
      observacion: "Cliente frecuente",
    });

    expect(result.observacion).toBe("Cliente frecuente");
  });
});
