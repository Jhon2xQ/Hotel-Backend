import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { IUserRepository } from "../../domain/interfaces/user.repository.interface";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

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
