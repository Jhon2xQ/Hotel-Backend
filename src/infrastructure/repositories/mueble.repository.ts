import { PrismaClient } from "../../../generated/prisma/client";
import { Prisma } from "../../../generated/prisma/client";
import { Mueble, MuebleCondition, CreateMuebleData } from "../../domain/entities/mueble.entity";
import { IMuebleRepository, UpdateMuebleData } from "../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../domain/exceptions/mueble.exception";

export class MuebleRepository implements IMuebleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateMuebleData): Promise<Mueble> {
    try {
      const result = await this.prisma.mueble.create({
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion ?? null,
          categoriaId: data.categoriaId,
          imagenUrl: data.imagenUrl ?? null,
          condicion: data.condicion ?? MuebleCondition.Bueno,
          fechaAdq: data.fechaAdq ?? null,
          ultimaRevision: data.ultimaRevision ?? null,
          habitacionId: data.habitacionId ?? null,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw MuebleException.duplicateCodigo();
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Mueble[]> {
    const results = await this.prisma.mueble.findMany({
      orderBy: { nombre: "asc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Mueble | null> {
    const result = await this.prisma.mueble.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Mueble | null> {
    const result = await this.prisma.mueble.findUnique({
      where: { codigo },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateMuebleData): Promise<Mueble> {
    try {
      const updateData: any = {};

      if (data.codigo !== undefined) updateData.codigo = data.codigo;
      if (data.nombre !== undefined) updateData.nombre = data.nombre;
      if (data.categoriaId !== undefined) updateData.categoriaId = data.categoriaId;
      if (data.imagenUrl !== undefined) updateData.imagenUrl = data.imagenUrl ?? null;
      if (data.condicion !== undefined) updateData.condicion = data.condicion;
      if (data.fechaAdq !== undefined) updateData.fechaAdq = data.fechaAdq ?? null;
      if (data.ultimaRevision !== undefined) updateData.ultimaRevision = data.ultimaRevision ?? null;
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;
      if (data.habitacionId !== undefined) updateData.habitacionId = data.habitacionId;

      const result = await this.prisma.mueble.update({
        where: { id },
        data: updateData,
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw MuebleException.duplicateCodigo();
        }
        if (error.code === "P2025") {
          throw MuebleException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.mueble.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw MuebleException.notFoundById();
        }
      }
      throw error;
    }
  }

  private toDomain(data: any): Mueble {
    return new Mueble(
      data.id,
      data.codigo,
      data.nombre,
      data.descripcion,
      data.categoriaId,
      data.imagenUrl,
      data.condicion as MuebleCondition,
      data.fechaAdq,
      data.ultimaRevision,
      data.habitacionId,
      data.createdAt,
      data.updatedAt,
    );
  }
}
