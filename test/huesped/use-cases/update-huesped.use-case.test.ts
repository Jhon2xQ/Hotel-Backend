import { describe, it, expect, beforeEach } from "vitest";
import { UpdateHuespedUseCase } from "../../../src/application/use-cases/huesped/update-huesped.use-case";
import { IHuespedRepository } from "../../../src/domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../src/domain/exceptions/huesped.exception";
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

  it("should update nivel_vip", async () => {
    const mockHuesped = createMockHuesped({ nivelVip: 2 });
    mockRepository.update = async () => mockHuesped;

    const result = await useCase.execute("test-huesped-id", {
      nivelVip: 2,
    });

    expect(result.nivelVip).toBe(2);
  });

  it("should throw error if nivel_vip is less than 0", async () => {
    await expect(
      useCase.execute("test-huesped-id", {
        nivelVip: -1,
      }),
    ).rejects.toThrow(HuespedException);
  });

  it("should throw error if nivel_vip is greater than 2", async () => {
    await expect(
      useCase.execute("test-huesped-id", {
        nivelVip: 5,
      }),
    ).rejects.toThrow(HuespedException);
  });

  it("should update multiple fields", async () => {
    const mockHuesped = createMockHuesped({
      telefono: "+51988888888",
      nivelVip: 1,
      notas: "Cliente VIP actualizado",
    });
    mockRepository.update = async () => mockHuesped;

    const result = await useCase.execute("test-huesped-id", {
      telefono: "+51988888888",
      nivelVip: 1,
      notas: "Cliente VIP actualizado",
    });

    expect(result.telefono).toBe("+51988888888");
    expect(result.nivelVip).toBe(1);
    expect(result.notas).toBe("Cliente VIP actualizado");
  });
});
