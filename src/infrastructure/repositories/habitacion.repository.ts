import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import {
  Habitacion,
  CreateHabitacionData,
  EstadoHabitacion,
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
          tipoHabitacionId: data.tipoHabitacionId,
          piso: data.piso,
          tieneDucha: data.tieneDucha ?? false,
          tieneBanio: data.tieneBanio ?? false,
          urlImagen: data.urlImagen ?? undefined,
          estado: data.estado ?? EstadoHabitacion.DISPONIBLE,
          notas: data.notas,
        },
        include: { tipo: true },
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
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async findByNumero(numero: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { nroHabitacion: numero },
      include: {
        tipo: true,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateHabitacionData): Promise<Habitacion> {
    try {
      const updateData: any = {};

      if (data.nroHabitacion !== undefined) updateData.nroHabitacion = data.nroHabitacion;
      if (data.tipoHabitacionId !== undefined) updateData.tipoHabitacionId = data.tipoHabitacionId;
      if (data.piso !== undefined) updateData.piso = data.piso;
      if (data.tieneDucha !== undefined) updateData.tieneDucha = data.tieneDucha;
      if (data.tieneBanio !== undefined) updateData.tieneBanio = data.tieneBanio;
      if (data.urlImagen !== undefined) updateData.urlImagen = data.urlImagen;
      if (data.estado !== undefined) updateData.estado = data.estado;
      if (data.notas !== undefined) updateData.notas = data.notas;

      // Handle ultimaLimpieza logic: set to current timestamp when estado changes to LIMPIEZA
      if (data.estado === EstadoHabitacion.LIMPIEZA) {
        updateData.ultimaLimpieza = new Date();
      }

      const result = await this.prisma.habitacion.update({
        where: { id },
        data: updateData,
        include: {
          tipo: true,
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

      const result = await this.prisma.habitacion.update({
        where: { id },
        data: updateData,
        include: {
          tipo: true,
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

  async findAvailableWithFilters(filters: {
    tipoNombre?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    ordenPrecio?: "asc" | "desc";
  }): Promise<Array<Habitacion & { precioNoche?: number }>> {
    const whereClause: any = {};

    // Filtro por tipo de habitación
    if (filters.tipoNombre) {
      whereClause.tipo = {
        nombre: {
          contains: filters.tipoNombre,
          mode: "insensitive",
        },
      };
    }

    // Filtro por disponibilidad en rango de fechas
    if (filters.fechaInicio && filters.fechaFin) {
      whereClause.reservas = {
        none: {
          AND: [
            {
              OR: [{ estado: "CONFIRMADA" }, { estado: "EN_CASA" }],
            },
            {
              OR: [
                {
                  AND: [{ fechaEntrada: { lte: filters.fechaInicio } }, { fechaSalida: { gt: filters.fechaInicio } }],
                },
                {
                  AND: [{ fechaEntrada: { lt: filters.fechaFin } }, { fechaSalida: { gte: filters.fechaFin } }],
                },
                {
                  AND: [{ fechaEntrada: { gte: filters.fechaInicio } }, { fechaSalida: { lte: filters.fechaFin } }],
                },
              ],
            },
          ],
        },
      };
    }

    const orderBy: any = {};
    if (filters.ordenPrecio) {
      orderBy.tipo = {
        tarifas: {
          _count: filters.ordenPrecio,
        },
      };
    }

    const results = await this.prisma.habitacion.findMany({
      where: whereClause,
      include: {
        tipo: {
          include: {
            tarifas: {
              orderBy: {
                precioNoche: filters.ordenPrecio || "asc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: orderBy.tipo ? orderBy : { nroHabitacion: "asc" },
    });

    // Mapear resultados con precio
    const habitacionesConPrecio = results.map((r) => {
      const habitacion = this.toDomain(r);
      const precioNoche = r.tipo?.tarifas?.[0]?.precioNoche ? Number(r.tipo.tarifas[0].precioNoche) : undefined;

      return Object.assign(habitacion, { precioNoche });
    });

    // Ordenar por precio si se especificó
    if (filters.ordenPrecio) {
      habitacionesConPrecio.sort((a, b) => {
        const precioA = a.precioNoche ?? Number.MAX_VALUE;
        const precioB = b.precioNoche ?? Number.MAX_VALUE;
        return filters.ordenPrecio === "asc" ? precioA - precioB : precioB - precioA;
      });
    }

    return habitacionesConPrecio;
  }

  private toDomain(data: any): Habitacion {
    const tipo: TipoHabitacionBasic | null = data.tipo
      ? {
          id: data.tipo.id,
          nombre: data.tipo.nombre,
          descripcion: data.tipo.descripcion,
        }
      : null;

    return new Habitacion(
      data.id,
      data.nroHabitacion,
      data.tipoHabitacionId,
      tipo,
      data.piso,
      data.tieneDucha,
      data.tieneBanio,
      data.urlImagen,
      data.estado as EstadoHabitacion,
      data.notas,
      data.ultimaLimpieza,
      data.createdAt,
      data.updatedAt,
    );
  }
}
