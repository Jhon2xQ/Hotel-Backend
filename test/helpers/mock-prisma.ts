import { vi } from "vitest";
import { PrismaClient } from "../../generated/prisma/client";

export function createMockPrismaClient(): PrismaClient {
  return {
    habitacion: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as any;
}
