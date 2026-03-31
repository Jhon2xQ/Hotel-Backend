import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 300_000,
    max: 20,
  });
  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();
