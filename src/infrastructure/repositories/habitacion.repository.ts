import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Habitacion, EstadoHabitacion } from "../../domain/entities/habitacion.entity";
import type {
  IHabitacionRepository,
  CreateHabitacionParams,
  UpdateHabitacionParams,
  UpdateHabitacionStatusParams,
} from "../../domain/interfaces/habitacion.repository.interface";
import { mapHabitacionFromPrisma } from "../mappers/habitacion.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class HabitacionRepository implements IHabitacionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateHabitacionParams): Promise<Habitacion> {
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
        ultimaLimpieza: data.ultiLimpieza ?? undefined,
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

  async findById(id: string): Promise<Habitacion | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
      include: { tipo: true },
    });
    return result ? mapHabitacionFromPrisma(result) : null;
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
    if (data.tieneDucha !== undefined) updateData.tieneDucha = data.tieneDucha;
    if (data.tieneBanio !== undefined) updateData.tieneBanio = data.tieneBanio;
    if (data.urlImagen !== undefined) updateData.urlImagen = data.urlImagen;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.notas !== undefined) updateData.notas = data.notas;
    if (data.ultiLimpieza !== undefined) updateData.ultimaLimpieza = data.ultiLimpieza;

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
    if (data.ultiLimpieza !== undefined) updateData.ultimaLimpieza = data.ultiLimpieza;

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
    const estanciaCount = await this.prisma.estancia.count({ where: { habitacionId: id } });
    return estanciaCount > 0;
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
      precioNoche: r.tipo?.tarifas?.[0]?.precioNoche ? Number(r.tipo.tarifas[0].precioNoche) : null,
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
      precioNoche: r.tipo?.tarifas?.[0]?.precioNoche ? Number(r.tipo.tarifas[0].precioNoche) : null,
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
      precioNoche: r.tipo?.tarifas?.[0]?.precioNoche ? Number(r.tipo.tarifas[0].precioNoche) : null,
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
      precioNoche: result.tipo?.tarifas?.[0]?.precioNoche ? Number(result.tipo.tarifas[0].precioNoche) : null,
    };
  }
}
