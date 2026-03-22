import { describe, it, expect, beforeEach } from "vitest";
import { UpdateHuespedUseCase } from "../../../src/application/use-cases/huesped/update-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { createMockHuesped } from "../../helpers/huesped-fixtures";

describe("UpdateHuespedUseCase", () => {
  let useCase: UpdateHuespedUseCase;
  let mockRepository: IHuespedRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHuesped(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockHuesped(),
      delete: async () => {},
    };

    useCase = new UpdateHuespedUseCase(mockRepository);
  });

  it("should update huesped successfully", async () => {
    const mockHuesped = createMockHuesped({ telefono: "+51999999999" });
    mockRepository.update = async () => mockHuesped;

    const result = await useCase.execute("test-huesped-id", {
      telefono: "+51999999999",
    });

    expect(result.telefono).toBe("+51999999999");
  });

  it("should update tipo_doc and nro_doc", async () => {
    const mockHuesped = createMockHuesped({ tipo_doc: "PASAPORTE", nro_doc: "AB123456" });
    mockRepository.update = async () => mockHuesped;

    const result = await useCase.execute("test-huesped-id", {
      tipo_doc: "PASAPORTE",
      nro_doc: "AB123456",
    });

    expect(result.tipo_doc).toBe("PASAPORTE");
    expect(result.nro_doc).toBe("AB123456");
  });

  it("should update multiple fields", async () => {
    const mockHuesped = createMockHuesped({
      telefono: "+51988888888",
      observacion: "Cliente VIP actualizado",
    });
    mockRepository.update = async () => mockHuesped;

    const result = await useCase.execute("test-huesped-id", {
      telefono: "+51988888888",
      observacion: "Cliente VIP actualizado",
    });

    expect(result.telefono).toBe("+51988888888");
    expect(result.observacion).toBe("Cliente VIP actualizado");
  });
});
