import { describe, it, expect, beforeEach } from "vitest";
import { ListCanalUseCase } from "../../../src/application/use-cases/canal/list-canal.use-case";
import { ICanalRepository } from "../../../src/domain/interfaces/canal.repository.interface";
import { createMockCanal } from "../../helpers/canal-fixtures";

describe("ListCanalUseCase", () => {
  let useCase: ListCanalUseCase;
  let mockRepository: ICanalRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockCanal(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockCanal(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findByName: async () => null,
    };

    useCase = new ListCanalUseCase(mockRepository);
  });

  it("should return list of canales", async () => {
    const mockCanales = [
      createMockCanal({ id: "id-1", nombre: "Booking.com", tipo: "OTA" }),
      createMockCanal({ id: "id-2", nombre: "Directo", tipo: "DIRECTO" }),
      createMockCanal({ id: "id-3", nombre: "Agencia XYZ", tipo: "AGENTE" }),
    ];

    mockRepository.findAll = async () => mockCanales;

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].nombre).toBe("Booking.com");
    expect(result[0].tipo).toBe("OTA");
    expect(result[1].nombre).toBe("Directo");
    expect(result[1].tipo).toBe("DIRECTO");
    expect(result[2].nombre).toBe("Agencia XYZ");
    expect(result[2].tipo).toBe("AGENTE");
  });

  it("should return empty array when no canales exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });

  it("should return canales with different activo states", async () => {
    const mockCanales = [
      createMockCanal({ id: "id-1", nombre: "Activo", activo: true }),
      createMockCanal({ id: "id-2", nombre: "Inactivo", activo: false }),
    ];

    mockRepository.findAll = async () => mockCanales;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].activo).toBe(true);
    expect(result[1].activo).toBe(false);
  });
});
