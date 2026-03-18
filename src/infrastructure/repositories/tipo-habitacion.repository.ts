import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { TipoHabitacion, CreateTipoHabitacionData, CatalogoMueble } from "../../domain/entities/tipo-habitacion.entity";
import {
  ITipoHabitacionRepository,
  UpdateTipoHabitacionData,
} from "../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../domain/exceptions/tipo-habitacion.exception";

export class TipoHabitacionRepository implements ITipoHabitacionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTipoHabitacionData): Promise<TipoHabitacion> {
    const result = await this.prisma.tipoHabitacion.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        tieneDucha: data.tieneDucha,
        tieneBanio: data.tieneBanio,
        muebles: data.muebles?.length
          ? {
              connect: data.muebles.map((m) => ({ id: m.id })),
            }
          : undefined,
      },
      include: {
        muebles: true,
      },
    });
    return this.toDomain(result);
  }

  async findAll(): Promise<TipoHabitacion[]> {
    const results = await this.prisma.tipoHabitacion.findMany({
      include: {
        muebles: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<TipoHabitacion | null> {
    const result = await this.prisma.tipoHabitacion.findUnique({
      where: { id },
      include: {
        muebles: true,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateTipoHabitacionData): Promise<TipoHabitacion> {
    try {
      const updateData: any = {};

      if (data.nombre !== undefined) updateData.nombre = data.nombre;
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;
      if (data.tieneDucha !== undefined) updateData.tieneDucha = data.tieneDucha;
      if (data.tieneBanio !== undefined) updateData.tieneBanio = data.tieneBanio;

      // Handle muebles replacement using set operation
      if (data.muebles !== undefined) {
        updateData.muebles = {
          set: data.muebles.map((m) => ({ id: m.id })),
        };
      }

      const result = await this.prisma.tipoHabitacion.update({
        where: { id },
        data: updateData,
        include: {
          muebles: true,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw TipoHabitacionException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.tipoHabitacion.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw TipoHabitacionException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const [habitacionCount, tarifaCount, reservaCount] = await Promise.all([
      this.prisma.habitacion.count({ where: { tipoId: id } }),
      this.prisma.tarifa.count({ where: { tipoHabitacionId: id } }),
      this.prisma.reserva.count({ where: { tipoHabId: id } }),
    ]);

    return habitacionCount > 0 || tarifaCount > 0 || reservaCount > 0;
  }

  private toDomain(data: any): TipoHabitacion {
    const muebles: CatalogoMueble[] = data.muebles
      ? data.muebles.map((m: any) => ({
          id: m.id,
          codigo: m.codigo,
          nombre: m.nombre,
          categoria: m.categoria,
        }))
      : [];

    return new TipoHabitacion(
      data.id,
      data.nombre,
      data.descripcion,
      data.tieneDucha,
      data.tieneBanio,
      muebles,
      data.createdAt,
      data.updatedAt,
    );
  }
}
