import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
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
        fechaEntrada: data.fechaEntrada,
        fechaSalida: data.fechaSalida,
        adultos: data.adultos,
        ninos: data.ninos,
        nombreHuesped: data.nombreHuesped,
        nroHabitacion: data.nroHabitacion,
        nombreTipoHab: data.nombreTipoHab,
        nombreCanal: data.nombreCanal,
        precioNoche: data.precioNoche,
        IVA: data.IVA,
        cargoServicios: data.cargoServicios,
        montoTotal: data.montoTotal,
        montoDescuento: data.montoDescuento,
        montoFinal: data.montoFinal,
        estado: EstadoReserva.TENTATIVA,
      },
      include: this.getIncludeRelations(),
    });

    return mapReservaFromPrisma(result);
  }

  async findAll(): Promise<Reserva[]> {
    const results = await this.prisma.reserva.findMany({
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapReservaFromPrisma(r));
  }

  async findAllPaginated(params: ReservaPaginationParams): Promise<PaginatedResult<Reserva>> {
    const { page, limit, name, tipo } = params;
    const skip = (page - 1) * limit;

    const conditions: Record<string, unknown>[] = [];

    if (name) {
      conditions.push({
        nombreHuesped: { contains: name, mode: "insensitive" },
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
        include: this.getIncludeRelations(),
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

  async findById(id: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { id },
      include: this.getIncludeRelations(),
    });
    return result ? mapReservaFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { codigo },
      include: this.getIncludeRelations(),
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
        precioNoche: snapshotData.precioNoche,
        IVA: snapshotData.IVA,
        cargoServicios: snapshotData.cargoServicios,
      });
    }

    if (data.pagoId !== undefined) updateData.pagoId = data.pagoId;
    if (data.fechaEntrada) updateData.fechaEntrada = data.fechaEntrada;
    if (data.fechaSalida) updateData.fechaSalida = data.fechaSalida;
    if (data.adultos !== undefined) updateData.adultos = data.adultos;
    if (data.ninos !== undefined) updateData.ninos = data.ninos;
    if (data.estado) updateData.estado = data.estado;
    if (data.motivoCancel !== undefined) updateData.motivoCancel = data.motivoCancel;
    if (data.canceladoEn !== undefined) updateData.canceladoEn = data.canceladoEn;

    if (data.fechaEntrada || data.fechaSalida || data.tarifaId || data.montoDescuento !== undefined) {
      const fechaEntrada = data.fechaEntrada || existing.fechaEntrada;
      const fechaSalida = data.fechaSalida || existing.fechaSalida;
      const precioNoche = (updateData.precioNoche as number) || Number(existing.precioNoche);
      const montoDescuento =
        data.montoDescuento !== undefined ? data.montoDescuento : Number(existing.montoDescuento);

      const nights = this.calculateNights(fechaEntrada, fechaSalida);
      const montoTotal = precioNoche * nights;
      const montoFinal = montoTotal - montoDescuento;

      updateData.montoTotal = montoTotal;
      updateData.montoDescuento = montoDescuento;
      updateData.montoFinal = montoFinal;
    }

    const result = await this.prisma.reserva.update({
      where: { id },
      data: updateData,
      include: this.getIncludeRelations(),
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
      include: this.getIncludeRelations(),
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
    precioNoche: number;
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
      precioNoche: Number(tarifa.precioNoche),
      IVA: Number(tarifa.IVA || 0),
      cargoServicios: Number(tarifa.cargoServicios || 0),
    };
  }

  private calculateNights(fechaEntrada: Date, fechaSalida: Date): number {
    const diff = fechaSalida.getTime() - fechaEntrada.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private getIncludeRelations() {
    return {
      huesped: true,
      habitacion: {
        include: {
          tipo: true,
        },
      },
      tarifa: {
        include: {
          tipoHabitacion: true,
          canal: true,
        },
      },
      pago: true,
    };
  }
}
