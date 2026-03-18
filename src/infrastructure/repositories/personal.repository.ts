import { PrismaClient } from "../../../generated/prisma/client";
import { IPersonalRepository } from "../../domain/interfaces/personal.repository.interface";

export class PersonalRepository implements IPersonalRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<{ id: string; codigo: string; nombres: string; apellidos: string } | null> {
    const result = await this.prisma.personal.findUnique({
      where: { id },
      select: {
        id: true,
        codigo: true,
        nombres: true,
        apellidos: true,
      },
    });
    return result;
  }
}
