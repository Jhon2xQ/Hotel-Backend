import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { CategoriaMueble } from "../../domain/entities/categoria-mueble.entity";
import type {
  ICategoriaMuebleRepository,
  CreateCategoriaMuebleParams,
  UpdateCategoriaMuebleParams,
} from "../../domain/interfaces/categoria-mueble.repository.interface";
import { mapCategoriaMuebleFromPrisma } from "../mappers/categoria-mueble.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class CategoriaMuebleRepository implements ICategoriaMuebleRepository {
  constructor(
    @inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async create(data: CreateCategoriaMuebleParams): Promise<CategoriaMueble> {
    const result = await this.prisma.categoriaMueble.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        activo: data.activo ?? true,
      },
    });
    return mapCategoriaMuebleFromPrisma(result);
  }

  async findAll(): Promise<CategoriaMueble[]> {
    const results = await this.prisma.categoriaMueble.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((h) => mapCategoriaMuebleFromPrisma(h));
  }

  async findById(id: string): Promise<CategoriaMueble | null> {
    const result = await this.prisma.categoriaMueble.findUnique({
      where: { id },
    });
    return result ? mapCategoriaMuebleFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateCategoriaMuebleParams): Promise<CategoriaMueble> {
    const result = await this.prisma.categoriaMueble.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: data.activo,
      },
    });
    return mapCategoriaMuebleFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.categoriaMueble.delete({
      where: { id },
    });
  }

  async findByName(nombre: string): Promise<CategoriaMueble | null> {
    const result = await this.prisma.categoriaMueble.findUnique({
      where: { nombre },
    });
    return result ? mapCategoriaMuebleFromPrisma(result) : null;
  }
}
