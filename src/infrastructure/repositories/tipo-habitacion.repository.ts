import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import type { Habitacion } from "../../domain/entities/habitacion.entity";
import type {
  ITipoHabitacionRepository,
  CreateTipoHabitacionParams,
  UpdateTipoHabitacionParams,
} from "../../domain/interfaces/tipo-habitacion.repository.interface";
import { mapTipoHabitacionFromPrisma } from "../mappers/tipo-habitacion.mapper";
import { mapHabitacionFromPrisma } from "../mappers/habitacion.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class TipoHabitacionRepository implements ITipoHabitacionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateTipoHabitacionParams): Promise<TipoHabitacion> {
    const result = await this.prisma.tipoHabitacion.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
      },
    });
    return mapTipoHabitacionFromPrisma(result);
  }

  async findAll(): Promise<TipoHabitacion[]> {
    const results = await this.prisma.tipoHabitacion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapTipoHabitacionFromPrisma(r));
  }

  async findAllWithSampleHabitacion(): Promise<Array<{ tipoHabitacion: TipoHabitacion; habitacion: Habitacion | null }>> {
    const results = await this.prisma.tipoHabitacion.findMany({
      include: {
        habitaciones: {
          take: 1,
          include: { tipo: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return results.map((r) => ({
      tipoHabitacion: mapTipoHabitacionFromPrisma(r),
      habitacion: r.habitaciones[0] ? mapHabitacionFromPrisma(r.habitaciones[0]) : null,
    }));
  }

  async findById(id: string): Promise<TipoHabitacion | null> {
    const result = await this.prisma.tipoHabitacion.findUnique({ where: { id } });
    return result ? mapTipoHabitacionFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateTipoHabitacionParams): Promise<TipoHabitacion> {
    const updateData: Record<string, unknown> = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;

    const result = await this.prisma.tipoHabitacion.update({
      where: { id },
      data: updateData,
    });
    return mapTipoHabitacionFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tipoHabitacion.delete({ where: { id } });
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const habitacionCount = await this.prisma.habitacion.count({ where: { tipoHabitacionId: id } });
    return habitacionCount > 0;
  }

  async findByName(nombre: string): Promise<TipoHabitacion | null> {
    const result = await this.prisma.tipoHabitacion.findUnique({ where: { nombre } });
    return result ? mapTipoHabitacionFromPrisma(result) : null;
  }
}
