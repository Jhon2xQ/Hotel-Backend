import { vi } from "vitest";
import { PrismaClient } from "../../generated/prisma/client";

export function createMockPrismaClient(): PrismaClient {
  return {
    $transaction: vi.fn().mockImplementation(async (arg: any) => {
      if (Array.isArray(arg)) {
        return arg;
      }
      return arg();
    }),
    habitacion: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as any;
}
