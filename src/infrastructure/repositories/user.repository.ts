import { PrismaClient } from "../../../generated/prisma/client";
import { IUserRepository } from "../../domain/interfaces/user.repository.interface";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<{ id: string; name: string; email: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }
}
