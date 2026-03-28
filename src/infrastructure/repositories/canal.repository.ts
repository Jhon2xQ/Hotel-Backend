import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Canal } from "../../domain/entities/canal.entity";
import type {
  ICanalRepository,
  CreateCanalParams,
  UpdateCanalParams,
} from "../../domain/interfaces/canal.repository.interface";
import { mapCanalFromPrisma } from "../mappers/canal.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class CanalRepository implements ICanalRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateCanalParams): Promise<Canal> {
    const result = await this.prisma.canal.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo as "OTA" | "DIRECTO" | "AGENTE",
        activo: data.activo ?? true,
        notas: data.notas ?? null,
      },
    });
    return mapCanalFromPrisma(result);
  }

  async findAll(): Promise<Canal[]> {
    const results = await this.prisma.canal.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapCanalFromPrisma(r));
  }

  async findById(id: string): Promise<Canal | null> {
    const result = await this.prisma.canal.findUnique({ where: { id } });
    return result ? mapCanalFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateCanalParams): Promise<Canal> {
    const updateData: Record<string, unknown> = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.activo !== undefined) updateData.activo = data.activo;
    if (data.notas !== undefined) updateData.notas = data.notas ?? null;

    const result = await this.prisma.canal.update({
      where: { id },
      data: updateData,
    });
    return mapCanalFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.canal.delete({ where: { id } });
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const tarifaCount = await this.prisma.tarifa.count({ where: { canalId: id } });
    return tarifaCount > 0;
  }

  async findByName(nombre: string): Promise<Canal | null> {
    const result = await this.prisma.canal.findUnique({ where: { nombre } });
    return result ? mapCanalFromPrisma(result) : null;
  }
}
