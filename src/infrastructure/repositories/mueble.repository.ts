import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Mueble, MuebleCondition } from "../../domain/entities/mueble.entity";
import type {
  IMuebleRepository,
  CreateMuebleParams,
  UpdateMuebleParams,
} from "../../domain/interfaces/mueble.repository.interface";
import { mapMuebleFromPrisma } from "../mappers/mueble.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class MuebleRepository implements IMuebleRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateMuebleParams): Promise<Mueble> {
    const result = await this.prisma.mueble.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        categoriaId: data.categoriaId,
        urlImagen: data.urlImagen ?? null,
        condicion: data.condicion ?? MuebleCondition.Bueno,
        fechaAdq: data.fechaAdq ?? null,
        ultimaRevision: data.ultimaRevision ?? null,
        habitacionId: data.habitacionId ?? null,
      },
      include: { categoria: true },
    });
    return mapMuebleFromPrisma(result);
  }

  async findAll(): Promise<Mueble[]> {
    const results = await this.prisma.mueble.findMany({
      include: { categoria: true },
      orderBy: { nombre: "asc" },
    });
    return results.map((r) => mapMuebleFromPrisma(r));
  }

  async findById(id: string): Promise<Mueble | null> {
    const result = await this.prisma.mueble.findUnique({
      where: { id },
      include: { categoria: true },
    });
    return result ? mapMuebleFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Mueble | null> {
    const result = await this.prisma.mueble.findUnique({
      where: { codigo },
      include: { categoria: true },
    });
    return result ? mapMuebleFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateMuebleParams): Promise<Mueble> {
    const updateData: Record<string, unknown> = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.categoriaId !== undefined) updateData.categoriaId = data.categoriaId;
    if (data.urlImagen !== undefined) updateData.urlImagen = data.urlImagen;
    if (data.condicion !== undefined) updateData.condicion = data.condicion;
    if (data.fechaAdq !== undefined) updateData.fechaAdq = data.fechaAdq ?? null;
    if (data.ultimaRevision !== undefined) {
      updateData.ultimaRevision = data.ultimaRevision ?? null;
    }
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;
    if (data.habitacionId !== undefined) updateData.habitacionId = data.habitacionId;

    const result = await this.prisma.mueble.update({
      where: { id },
      data: updateData,
      include: { categoria: true },
    });
    return mapMuebleFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mueble.delete({
      where: { id },
    });
  }
}
