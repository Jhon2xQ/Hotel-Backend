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
      },
    });
    return this.toDomain(result);
  }

  async findAll(): Promise<TipoHabitacion[]> {
    const results = await this.prisma.tipoHabitacion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<TipoHabitacion | null> {
    const result = await this.prisma.tipoHabitacion.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateTipoHabitacionData): Promise<TipoHabitacion> {

    try {
      const existing = await this.prisma.tipoHabitacion.findUnique({
        where: { id },
      });
      if (!existing) {
        throw TipoHabitacionException.notFoundById();
      }
      const updateData: any = {};

      if (data.nombre !== undefined) {
        const duplicate = await this.prisma.tipoHabitacion.findUnique({
          where: { nombre: data.nombre },
        });
        if (duplicate && duplicate.id !== id) {
          throw TipoHabitacionException.duplicateNombre(data.nombre);
        }
      };
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;

      const result = await this.prisma.tipoHabitacion.update({
        where: { id },
        data: updateData,
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw TipoHabitacionException.notFoundById();
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
          throw TipoHabitacionException.notFoundById();
        }
      }
      throw error;
    }
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    // Check if there are habitaciones using this tipo
    const habitacionCount = await this.prisma.habitacion.count({ where: {  tipoHabitacionId: id } });

    return habitacionCount > 0;
  }

  async findByName(nombre: string): Promise<TipoHabitacion | null> {
    const result = await this.prisma.tipoHabitacion.findUnique({
      where: { nombre },
    });
    return result ? this.toDomain(result) : null;
  }

  private toDomain(data: any): TipoHabitacion {
    return new TipoHabitacion(data.id, data.nombre, data.descripcion, data.createdAt, data.updatedAt);
  }
}
