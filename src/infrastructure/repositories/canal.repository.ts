import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { Canal, CreateCanalData } from "../../domain/entities/canal.entity";
import type { ICanalRepository, UpdateCanalData } from "../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../domain/exceptions/canal.exception";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class CanalRepository implements ICanalRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateCanalData): Promise<Canal> {
    const result = await this.prisma.canal.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo as any,
        activo: data.activo ?? true,
        notas: data.notas ?? null,
      },
    });
    return this.toDomain(result);
  }

  async findAll(): Promise<Canal[]> {
    const results = await this.prisma.canal.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Canal | null> {
    const result = await this.prisma.canal.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateCanalData): Promise<Canal> {
    try {
      const existing = await this.prisma.canal.findUnique({
        where: { id },
      });
      if (!existing) {
        throw CanalException.notFoundById();
      }

      const updateData: any = {};

      if (data.nombre !== undefined) {
        const duplicate = await this.prisma.canal.findUnique({
          where: { nombre: data.nombre },
        });
        if (duplicate && duplicate.id !== id) {
          throw CanalException.duplicateNombre(data.nombre);
        }
        updateData.nombre = data.nombre;
      }
      if (data.tipo !== undefined) updateData.tipo = data.tipo;
      if (data.activo !== undefined) updateData.activo = data.activo;
      if (data.notas !== undefined) updateData.notas = data.notas ?? null;

      const result = await this.prisma.canal.update({
        where: { id },
        data: updateData,
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw CanalException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.canal.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw CanalException.notFoundById();
        }
      }
      throw error;
    }
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const tarifaCount = await this.prisma.tarifa.count({ where: { canalId: id } });
    return tarifaCount > 0;
  }

  async findByName(nombre: string): Promise<Canal | null> {
    const result = await this.prisma.canal.findUnique({
      where: { nombre },
    });
    return result ? this.toDomain(result) : null;
  }

  private toDomain(data: any): Canal {
    return new Canal(data.id, data.nombre, data.tipo, data.activo, data.notas, data.createdAt, data.updatedAt);
  }
}
