import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Habitacion } from "../../domain/entities/habitacion.entity";
import type { Mueble } from "../../domain/entities/mueble.entity";
import type { EstadoReserva } from "../../domain/entities/reserva.entity";
import type {
  IHabitacionRepository,
  CreateHabitacionParams,
  UpdateHabitacionParams,
  UpdateHabitacionStatusParams,
  HabitacionPaginationParams,
} from "../../domain/interfaces/habitacion.repository.interface";
import type { PaginatedResult } from "../../application/paginations/api.pagination";
import { mapHabitacionFromPrisma } from "../mappers/habitacion.mapper";
import { mapMuebleFromPrisma } from "../mappers/mueble.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";
import type { HabitacionConPromociones } from "../../domain/interfaces/habitacion.repository.interface";

@injectable()
export class HabitacionRepository implements IHabitacionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateHabitacionParams): Promise<Habitacion> {
    const result = await this.prisma.habitacion.create({
      data: {
        nroHabitacion: data.nroHabitacion,
        tipoHabitacionId: data.tipoHabitacionId,
        piso: data.piso,
        feature: data.feature ?? null,
        amenities: data.amenities ?? null,
        urlImagen: data.urlImagen ?? undefined,
        estado: data.estado ?? false,
        descripcion: data.descripcion,
      },
      include: { tipo: true },
    });
    return mapHabitacionFromPrisma(result);
  }

  async findAll(): Promise<Habitacion[]> {
    const results = await this.prisma.habitacion.findMany({
      include: { tipo: true },
      orderBy: { nroHabitacion: "asc" },
    });
    return results.map((r) => mapHabitacionFromPrisma(r));
  }

  async findAllPaginated(params: HabitacionPaginationParams): Promise<PaginatedResult<HabitacionConPromociones>> {
    const { page, limit, numero, tipo, estado } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (numero) {
      where.nroHabitacion = { contains: numero, mode: "insensitive" };
    }
    if (tipo) {
      where.tipo = { nombre: { contains: tipo, mode: "insensitive" } };
    }
    if (estado !== undefined) {
      where.estado = estado;
    }

    const [habitaciones, total] = await Promise.all([
      this.prisma.habitacion.findMany({
        where,
        include: { tipo: true, promociones: { select: { id: true } } },
        take: limit,
        skip,
        orderBy: { nroHabitacion: "asc" },
      }),
      this.prisma.habitacion.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      list: habitaciones.map((h) => {
        const entity = mapHabitacionFromPrisma(h);
        return Object.assign(entity, {
          promociones: (h.promociones as Array<{ id: string }>).map((p) => p.id),
        });
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: { tipo: true },
    });
    return result ? mapHabitacionFromPrisma(result) : null;
  }

  async findByIdWithMuebles(id: string): Promise<{ habitacion: Habitacion; muebles: Mueble[] } | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: { tipo: true, muebles: { include: { categoria: true } } },
    });
    if (!result) return null;

    const muebles = result.muebles.map((m) => mapMuebleFromPrisma(m));
    return {
      habitacion: mapHabitacionFromPrisma(result),
      muebles,
    };
  }

  async findByIdWithReservas(
    id: string,
    estadosReserva: EstadoReserva[],
  ): Promise<{ habitacion: Habitacion; reservas: Array<{ fechaInicio: Date; fechaFin: Date; estado: EstadoReserva }> } | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: {
        tipo: true,
        reservas: {
          where: { estado: { in: estadosReserva } },
          select: { fechaInicio: true, fechaFin: true, estado: true },
          orderBy: { fechaInicio: "asc" },
        },
      },
    });

    if (!result) return null;

    return {
      habitacion: mapHabitacionFromPrisma(result),
      reservas: result.reservas.map((r) => ({
        fechaInicio: r.fechaInicio,
        fechaFin: r.fechaFin,
        estado: r.estado as EstadoReserva,
      })),
    };
  }

  async findByIdWithReservasAndMuebles(
    id: string,
    estadosReserva: EstadoReserva[],
  ): Promise<{ habitacion: HabitacionConPromociones; muebles: Mueble[]; reservas: Array<{ fechaInicio: Date; fechaFin: Date; estado: EstadoReserva }> } | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: {
        tipo: true,
        muebles: { include: { categoria: true } },
        promociones: { select: { id: true } },
        reservas: {
          where: { estado: { in: estadosReserva } },
          select: { fechaInicio: true, fechaFin: true, estado: true },
          orderBy: { fechaInicio: "asc" },
        },
      },
    });

    if (!result) return null;

    const muebles = result.muebles.map((m) => mapMuebleFromPrisma(m));
    const habitacion = mapHabitacionFromPrisma(result);
    const habitacionConPromociones = Object.assign(habitacion, {
      promociones: (result.promociones as Array<{ id: string }>).map((p) => p.id),
    });

    return {
      habitacion: habitacionConPromociones,
      muebles,
      reservas: result.reservas.map((r) => ({
        fechaInicio: r.fechaInicio,
        fechaFin: r.fechaFin,
        estado: r.estado as EstadoReserva,
      })),
    };
  }

  async findByNumero(numero: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { nroHabitacion: numero },
      include: { tipo: true },
    });
    return result ? mapHabitacionFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateHabitacionParams): Promise<Habitacion> {
    const updateData: Record<string, unknown> = {};

    if (data.nroHabitacion !== undefined) updateData.nroHabitacion = data.nroHabitacion;
    if (data.tipoHabitacionId !== undefined) updateData.tipoHabitacionId = data.tipoHabitacionId;
    if (data.piso !== undefined) updateData.piso = data.piso;
    if (data.feature !== undefined) updateData.feature = data.feature;
    if (data.amenities !== undefined) updateData.amenities = data.amenities;
    if (data.urlImagen !== undefined) updateData.urlImagen = data.urlImagen;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;

    const result = await this.prisma.habitacion.update({
      where: { id },
      data: updateData,
      include: { tipo: true },
    });
    return mapHabitacionFromPrisma(result);
  }

  async updateStatus(id: string, data: UpdateHabitacionStatusParams): Promise<Habitacion> {
    const updateData: Record<string, unknown> = {};

    if (data.estado !== undefined) updateData.estado = data.estado;

    const result = await this.prisma.habitacion.update({
      where: { id },
      data: updateData,
      include: { tipo: true },
    });
    return mapHabitacionFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.habitacion.delete({
      where: { id },
    });
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const reservaCount = await this.prisma.reserva.count({ where: { habitacionId: id } });
    return reservaCount > 0;
  }

  async findAllWithDirectPrice(): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>> {
    const results = await this.prisma.habitacion.findMany({
      include: {
        tipo: {
          include: {
            tarifas: {
              where: {
                canal: { tipo: "DIRECTO" },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { nroHabitacion: "asc" },
    });

    return results.map((r) => ({
      habitacion: mapHabitacionFromPrisma(r),
      precioNoche: r.tipo?.tarifas?.[0]?.precio ? Number(r.tipo.tarifas[0].precio) : null,
    }));
  }

  async findByTipoWithDirectPrice(
    tipoNombre: string,
  ): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>> {
    const results = await this.prisma.habitacion.findMany({
      where: {
        tipo: {
          nombre: { contains: tipoNombre, mode: "insensitive" },
        },
      },
      include: {
        tipo: {
          include: {
            tarifas: {
              where: { canal: { tipo: "DIRECTO" } },
              take: 1,
            },
          },
        },
      },
      orderBy: { nroHabitacion: "asc" },
    });

    return results.map((r) => ({
      habitacion: mapHabitacionFromPrisma(r),
      precioNoche: r.tipo?.tarifas?.[0]?.precio ? Number(r.tipo.tarifas[0].precio) : null,
    }));
  }

  async findAvailableInDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    tipoNombre?: string,
  ): Promise<Array<{ habitacion: Habitacion; precioNoche: number | null }>> {
    const whereClause: Record<string, unknown> = {};

    if (tipoNombre) {
      whereClause.tipo = {
        nombre: { contains: tipoNombre, mode: "insensitive" },
      };
    }

    whereClause.reservas = {
      none: {
        AND: [
          {
            estado: {
              in: ["CONFIRMADA", "EN_CASA", "TENTATIVA", "NO_LLEGO"],
            },
          },
          {
            OR: [
              {
                AND: [{ fechaEntrada: { lte: fechaInicio } }, { fechaSalida: { gt: fechaInicio } }],
              },
              {
                AND: [{ fechaEntrada: { lt: fechaFin } }, { fechaSalida: { gte: fechaFin } }],
              },
              {
                AND: [{ fechaEntrada: { gte: fechaInicio } }, { fechaSalida: { lte: fechaFin } }],
              },
            ],
          },
        ],
      },
    };

    const results = await this.prisma.habitacion.findMany({
      where: whereClause,
      include: {
        tipo: {
          include: {
            tarifas: {
              where: { canal: { tipo: "DIRECTO" } },
              take: 1,
            },
          },
        },
      },
      orderBy: { nroHabitacion: "asc" },
    });

    return results.map((r) => ({
      habitacion: mapHabitacionFromPrisma(r),
      precioNoche: r.tipo?.tarifas?.[0]?.precio ? Number(r.tipo.tarifas[0].precio) : null,
    }));
  }

  async findByIdWithDirectPrice(id: string): Promise<{ habitacion: Habitacion; precioNoche: number | null } | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: {
        tipo: {
          include: {
            tarifas: {
              where: { canal: { tipo: "DIRECTO" } },
              take: 1,
            },
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      habitacion: mapHabitacionFromPrisma(result),
      precioNoche: result.tipo?.tarifas?.[0]?.precio ? Number(result.tipo.tarifas[0].precio) : null,
    };
  }

  async findByIdWithDirectPriceAndMuebles(id: string): Promise<{ habitacion: Habitacion; muebles: Mueble[]; precioNoche: number | null } | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: {
        tipo: {
          include: {
            tarifas: {
              where: { canal: { tipo: "DIRECTO" } },
              take: 1,
            },
          },
        },
        muebles: { include: { categoria: true } },
      },
    });

    if (!result) {
      return null;
    }

    const muebles = result.muebles.map((m) => mapMuebleFromPrisma(m));
    return {
      habitacion: mapHabitacionFromPrisma(result),
      muebles,
      precioNoche: result.tipo?.tarifas?.[0]?.precio ? Number(result.tipo.tarifas[0].precio) : null,
    };
  }
}
