import { inject, injectable } from "tsyringe";
import { PrismaClient, EstadoReserva as PrismaEstadoReserva } from "../../../generated/prisma/client";
import { Reserva, EstadoReserva } from "../../domain/entities/reserva.entity";
import type {
  IReservaRepository,
  CreateReservaPersistParams,
  UpdateReservaParams,
  ReservaPaginationParams,
} from "../../domain/interfaces/reserva.repository.interface";
import type { PaginatedResult } from "../../application/paginations/api.pagination";
import { mapReservaFromPrisma } from "../mappers/reserva.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class ReservaRepository implements IReservaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateReservaPersistParams): Promise<Reserva> {
    const result = await this.prisma.reserva.create({
      data: {
        codigo: data.codigo,
        huespedId: data.huespedId,
        habitacionId: data.habitacionId,
        tarifaId: data.tarifaId,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        adultos: data.adultos,
        ninos: data.ninos,
        nombreHuesped: data.nombreHuesped,
        nroHabitacion: data.nroHabitacion,
        nombreTipoHab: data.nombreTipoHab,
        nombreCanal: data.nombreCanal,
        precioTarifa: data.precioTarifa,
        unidadTarifa: data.unidadTarifa,
        cantidadUnidad: data.cantidadUnidad,
        IVA: data.IVA,
        cargoServicios: data.cargoServicios,
        montoTotal: data.montoTotal,
        estado: EstadoReserva.TENTATIVA,
      },
    });

    return mapReservaFromPrisma(result);
  }

  async findAll(): Promise<Reserva[]> {
    const results = await this.prisma.reserva.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapReservaFromPrisma(r));
  }

  async findAllPaginated(params: ReservaPaginationParams): Promise<PaginatedResult<Reserva>> {
    const { page, limit, nombre, tipo } = params;
    const skip = (page - 1) * limit;

    const conditions: Record<string, unknown>[] = [];

    if (nombre) {
      conditions.push({
        nombreHuesped: { contains: nombre, mode: "insensitive" },
      });
    }

    if (tipo) {
      conditions.push({
        nombreTipoHab: { contains: tipo, mode: "insensitive" },
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : undefined;

    const [reservas, total] = await Promise.all([
      this.prisma.reserva.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.reserva.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      list: reservas.map((r) => mapReservaFromPrisma(r)),
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

  async findConflictingReservations(habitacionId: string, fechaInicio: Date, fechaFin: Date, excludeReservaId?: string): Promise<Reserva[]> {
    const conflictingStates: PrismaEstadoReserva[] = [PrismaEstadoReserva.TENTATIVA, PrismaEstadoReserva.CONFIRMADA, PrismaEstadoReserva.EN_CASA];

    const results = await this.prisma.reserva.findMany({
      where: {
        habitacionId,
        estado: { in: conflictingStates },
        NOT: excludeReservaId ? { id: excludeReservaId } : undefined,
        AND: [{ fechaInicio: { lt: fechaFin } }, { fechaFin: { gt: fechaInicio } }],
      },
    });

    return results.map((r) => mapReservaFromPrisma(r));
  }

  async findById(id: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { id },
    });
    return result ? mapReservaFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { codigo },
    });
    return result ? mapReservaFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateReservaParams): Promise<Reserva | null> {
    const existing = await this.prisma.reserva.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    const updateData: Record<string, unknown> = {};
    let needsSnapshotUpdate = false;

    if (data.huespedId && data.huespedId !== existing.huespedId) {
      updateData.huespedId = data.huespedId;
      needsSnapshotUpdate = true;
    }
    if (data.habitacionId && data.habitacionId !== existing.habitacionId) {
      updateData.habitacionId = data.habitacionId;
      needsSnapshotUpdate = true;
    }
    if (data.tarifaId && data.tarifaId !== existing.tarifaId) {
      updateData.tarifaId = data.tarifaId;
      needsSnapshotUpdate = true;
    }

    if (needsSnapshotUpdate) {
      const snapshotData = await this.fetchSnapshotData(
        data.huespedId || existing.huespedId,
        data.habitacionId || existing.habitacionId,
        data.tarifaId || existing.tarifaId,
      );
      if (!snapshotData) {
        return null;
      }
      Object.assign(updateData, {
        nombreHuesped: snapshotData.nombreHuesped,
        nroHabitacion: snapshotData.nroHabitacion,
        nombreTipoHab: snapshotData.nombreTipoHab,
        nombreCanal: snapshotData.nombreCanal,
        precioTarifa: snapshotData.precioTarifa,
        unidadTarifa: snapshotData.unidadTarifa,
        IVA: snapshotData.IVA,
        cargoServicios: snapshotData.cargoServicios,
      });
    }

    if (data.pagoId !== undefined) updateData.pagoId = data.pagoId;
    if (data.fechaInicio) updateData.fechaInicio = data.fechaInicio;
    if (data.fechaFin) updateData.fechaFin = data.fechaFin;
    if (data.adultos !== undefined) updateData.adultos = data.adultos;
    if (data.ninos !== undefined) updateData.ninos = data.ninos;
    if (data.estado) updateData.estado = data.estado;
    if (data.motivoCancel !== undefined) updateData.motivoCancel = data.motivoCancel;
    if (data.canceladoEn !== undefined) updateData.canceladoEn = data.canceladoEn;

    if (data.fechaInicio || data.fechaFin || data.tarifaId) {
      const fechaInicio = data.fechaInicio || existing.fechaInicio;
      const fechaFin = data.fechaFin || existing.fechaFin;
      const precioTarifa = (updateData.precioTarifa as number) || Number(existing.precioTarifa);
      const unidadTarifa = (updateData.unidadTarifa as string) || existing.unidadTarifa;
      const IVA = (updateData.IVA as number) || Number(existing.IVA);
      const cargoServicios = (updateData.cargoServicios as number) || Number(existing.cargoServicios);

      const units = this.calculateUnits(fechaInicio, fechaFin, unidadTarifa);
      const subtotalUnidades = precioTarifa * units;
      const montoTotal = subtotalUnidades * (1 + IVA / 100 + cargoServicios / 100);

      updateData.cantidadUnidad = units;
      updateData.montoTotal = Math.round(montoTotal * 100) / 100;
    }

    const result = await this.prisma.reserva.update({
      where: { id },
      data: updateData,
    });

    return mapReservaFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reserva.delete({
      where: { id },
    });
  }

  async cancel(id: string, motivoCancel: string): Promise<Reserva> {
    const result = await this.prisma.reserva.update({
      where: { id },
      data: {
        estado: EstadoReserva.CANCELADA,
        motivoCancel,
        canceladoEn: new Date(),
      },
    });

    return mapReservaFromPrisma(result);
  }

  private async fetchSnapshotData(
    huespedId: string,
    habitacionId: string,
    tarifaId: string,
  ): Promise<{
    nombreHuesped: string;
    nroHabitacion: string;
    nombreTipoHab: string;
    nombreCanal: string;
    precioTarifa: number;
    unidadTarifa: string;
    IVA: number;
    cargoServicios: number;
  } | null> {
    const huesped = await this.prisma.huesped.findUnique({
      where: { id: huespedId },
    });
    const habitacion = await this.prisma.habitacion.findUnique({
      where: { id: habitacionId },
    });
    const tarifa = await this.prisma.tarifa.findUnique({
      where: { id: tarifaId },
      include: {
        tipoHabitacion: true,
        canal: true,
      },
    });

    if (!huesped || !habitacion || !tarifa) {
      return null;
    }

    return {
      nombreHuesped: `${huesped.nombres} ${huesped.apellidos}`,
      nroHabitacion: habitacion.nroHabitacion,
      nombreTipoHab: tarifa.tipoHabitacion.nombre,
      nombreCanal: tarifa.canal.nombre,
      precioTarifa: Number(tarifa.precio),
      unidadTarifa: tarifa.unidad,
      IVA: Number(tarifa.IVA || 0),
      cargoServicios: Number(tarifa.cargoServicios || 0),
    };
  }

  private calculateUnits(fechaInicio: Date, fechaFin: Date, unidad: string): number {
    const msDiff = fechaFin.getTime() - fechaInicio.getTime();
    if (unidad === "horas") {
      const msPerHour = 1000 * 60 * 60;
      return Math.round(msDiff / msPerHour);
    }
    // noches: diferencia en días + 1 (se cuentan las noches de inicio, intermedias y fin)
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(msDiff / msPerDay) + 1;
  }
}
