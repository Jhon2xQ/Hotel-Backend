import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import {
  Habitacion,
  CreateHabitacionData,
  EstadoHabitacion,
  EstadoLimpieza,
  TipoHabitacionBasic,
} from "../../domain/entities/habitacion.entity";
import {
  IHabitacionRepository,
  UpdateHabitacionData,
  UpdateHabitacionStatusData,
} from "../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../domain/exceptions/habitacion.exception";
import type { CatalogoMueble } from "../../domain/entities/tipo-habitacion.entity";

export class HabitacionRepository implements IHabitacionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateHabitacionData): Promise<Habitacion> {
    try {
      const result = await this.prisma.habitacion.create({
        data: {
          nroHabitacion: data.nroHabitacion,
          tipoId: data.tipoId,
          piso: data.piso,
          tieneDucha: data.tieneDucha ?? false,
          tieneBanio: data.tieneBanio ?? false,
          urlImagen: data.urlImagen ?? null,
          estado: data.estado ?? EstadoHabitacion.DISPONIBLE,
          limpieza: data.limpieza ?? EstadoLimpieza.LIMPIA,
          notas: data.notas ?? null,
          muebles: data.muebles?.length
            ? {
                connect: data.muebles.map((m) => ({ id: m.id })),
              }
            : undefined,
        },
        include: {
          tipo: true,
          muebles: true,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw HabitacionException.duplicateNumero();
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Habitacion[]> {
    const results = await this.prisma.habitacion.findMany({
      include: {
        tipo: true,
        muebles: true,
      },
      orderBy: { nroHabitacion: "asc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: {
        tipo: true,
        muebles: true,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async findByNumero(numero: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { nroHabitacion: numero },
      include: {
        tipo: true,
        muebles: true,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateHabitacionData): Promise<Habitacion> {
    try {
      const updateData: any = {};

      if (data.nroHabitacion !== undefined) updateData.nroHabitacion = data.nroHabitacion;
      if (data.tipoId !== undefined) updateData.tipoId = data.tipoId;
      if (data.piso !== undefined) updateData.piso = data.piso;
      if (data.tieneDucha !== undefined) updateData.tieneDucha = data.tieneDucha;
      if (data.tieneBanio !== undefined) updateData.tieneBanio = data.tieneBanio;
      if (data.urlImagen !== undefined) updateData.urlImagen = data.urlImagen ?? null;
      if (data.estado !== undefined) updateData.estado = data.estado;
      if (data.limpieza !== undefined) updateData.limpieza = data.limpieza;
      if (data.notas !== undefined) updateData.notas = data.notas ?? null;

      // Handle ultimaLimpieza logic: set to current timestamp when estado changes to LIMPIEZA
      if (data.estado === EstadoHabitacion.LIMPIEZA) {
        updateData.ultimaLimpieza = new Date();
      }

      // Handle muebles replacement using set operation
      if (data.muebles !== undefined) {
        updateData.muebles = {
          set: data.muebles.map((m) => ({ id: m.id })),
        };
      }

      const result = await this.prisma.habitacion.update({
        where: { id },
        data: updateData,
        include: {
          tipo: true,
          muebles: true,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw HabitacionException.notFoundById();
        }
        if (error.code === "P2002") {
          throw HabitacionException.duplicateNumero();
        }
      }
      throw error;
    }
  }

  async updateStatus(id: string, data: UpdateHabitacionStatusData): Promise<Habitacion> {
    try {
      const updateData: any = {};

      if (data.estado !== undefined) updateData.estado = data.estado;
      if (data.limpieza !== undefined) updateData.limpieza = data.limpieza;

      // Handle ultimaLimpieza logic: set to current timestamp when limpieza changes to LIMPIA
      if (data.limpieza === EstadoLimpieza.LIMPIA) {
        updateData.ultimaLimpieza = new Date();
      }

      const result = await this.prisma.habitacion.update({
        where: { id },
        data: updateData,
        include: {
          tipo: true,
          muebles: true,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw HabitacionException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.habitacion.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw HabitacionException.notFoundById();
        }
      }
      throw error;
    }
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const estanciaCount = await this.prisma.estancia.count({ where: { habitacionId: id } });
    return estanciaCount > 0;
  }

  private toDomain(data: any): Habitacion {
    const tipo: TipoHabitacionBasic | null = data.tipo
      ? {
          id: data.tipo.id,
          nombre: data.tipo.nombre,
          descripcion: data.tipo.descripcion,
        }
      : null;

    const muebles: CatalogoMueble[] = data.muebles
      ? data.muebles.map((m: any) => ({
          id: m.id,
          codigo: m.codigo,
          nombre: m.nombre,
          categoria: m.categoria,
        }))
      : [];

    return new Habitacion(
      data.id,
      data.nroHabitacion,
      data.tipoId,
      tipo,
      data.piso,
      data.tieneDucha,
      data.tieneBanio,
      data.urlImagen,
      data.estado as EstadoHabitacion,
      data.limpieza as EstadoLimpieza,
      data.notas,
      data.ultimaLimpieza,
      muebles,
      data.createdAt,
      data.updatedAt,
    );
  }
}
