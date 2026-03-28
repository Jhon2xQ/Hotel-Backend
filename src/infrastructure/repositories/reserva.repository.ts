import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { Reserva, CreateReservaData, EstadoReserva } from "../../domain/entities/reserva.entity";
import { Huesped } from "../../domain/entities/huesped.entity";
import { Habitacion } from "../../domain/entities/habitacion.entity";
import { Tarifa } from "../../domain/entities/tarifa.entity";
import { Pago } from "../../domain/entities/pago.entity";
import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import { Canal } from "../../domain/entities/canal.entity";
import type { IReservaRepository, UpdateReservaData } from "../../domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class ReservaRepository implements IReservaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateReservaData): Promise<Reserva> {
    // Obtener entidades relacionadas para snapshot
    const snapshotData = await this.fetchSnapshotData(data.huespedId, data.habitacionId, data.tarifaId);

    // Calcular totales
    const nights = this.calculateNights(data.fechaEntrada, data.fechaSalida);
    const montoTotal = snapshotData.precioNoche * nights;
    const montoFinal = montoTotal - (data.montoDescuento || 0);

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
        // Snapshot
        nombreHuesped: snapshotData.nombreHuesped,
        nroHabitacion: snapshotData.nroHabitacion,
        nombreTipoHab: snapshotData.nombreTipoHab,
        nombreCanal: snapshotData.nombreCanal,
        // Precios
        precioNoche: snapshotData.precioNoche,
        IVA: snapshotData.IVA,
        cargoServicios: snapshotData.cargoServicios,
        // Totales
        montoTotal,
        montoDescuento: data.montoDescuento || 0,
        montoFinal,
        estado: "TENTATIVA",
      },
      include: this.getIncludeRelations(),
    });

    return this.toDomain(result);
  }

  async findAll(): Promise<Reserva[]> {
    const results = await this.prisma.reserva.findMany({
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { id },
      include: this.getIncludeRelations(),
    });
    return result ? this.toDomain(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Reserva | null> {
    const result = await this.prisma.reserva.findUnique({
      where: { codigo },
      include: this.getIncludeRelations(),
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateReservaData): Promise<Reserva> {
    try {
      const existing = await this.prisma.reserva.findUnique({
        where: { id },
      });

      if (!existing) {
        throw ReservaException.notFoundById();
      }

      const updateData: any = {};
      let needsSnapshotUpdate = false;

      // Detectar cambios en relaciones
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

      // Actualizar snapshot si hay cambios en relaciones
      if (needsSnapshotUpdate) {
        const snapshotData = await this.fetchSnapshotData(
          data.huespedId || existing.huespedId,
          data.habitacionId || existing.habitacionId,
          data.tarifaId || existing.tarifaId,
        );
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

      // Otros campos
      if (data.pagoId !== undefined) updateData.pagoId = data.pagoId;
      if (data.fechaEntrada) updateData.fechaEntrada = data.fechaEntrada;
      if (data.fechaSalida) updateData.fechaSalida = data.fechaSalida;
      if (data.adultos !== undefined) updateData.adultos = data.adultos;
      if (data.ninos !== undefined) updateData.ninos = data.ninos;
      if (data.estado) updateData.estado = data.estado;
      if (data.motivoCancel !== undefined) updateData.motivoCancel = data.motivoCancel;
      if (data.canceladoEn !== undefined) updateData.canceladoEn = data.canceladoEn;

      // Recalcular totales si cambian fechas, tarifa o descuento
      if (data.fechaEntrada || data.fechaSalida || data.tarifaId || data.montoDescuento !== undefined) {
        const fechaEntrada = data.fechaEntrada || existing.fechaEntrada;
        const fechaSalida = data.fechaSalida || existing.fechaSalida;
        const precioNoche = updateData.precioNoche || Number(existing.precioNoche);
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

      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw ReservaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.reserva.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw ReservaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async cancel(id: string, motivoCancel: string): Promise<Reserva> {
    const result = await this.prisma.reserva.update({
      where: { id },
      data: {
        estado: "CANCELADA",
        motivoCancel,
        canceladoEn: new Date(),
      },
      include: this.getIncludeRelations(),
    });

    return this.toDomain(result);
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
  }> {
    const huesped = await this.prisma.huesped.findUnique({
      where: { id: huespedId },
    });
    if (!huesped) {
      throw ReservaException.huespedNotFound();
    }

    const habitacion = await this.prisma.habitacion.findUnique({
      where: { id: habitacionId },
    });
    if (!habitacion) {
      throw ReservaException.habitacionNotFound();
    }

    const tarifa = await this.prisma.tarifa.findUnique({
      where: { id: tarifaId },
      include: {
        tipoHabitacion: true,
        canal: true,
      },
    });
    if (!tarifa) {
      throw ReservaException.tarifaNotFound();
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

  private toDomain(data: any): Reserva {
    if (!data.huesped || !data.habitacion || !data.tarifa) {
      throw new Error("Reserva must include huesped, habitacion, and tarifa relations");
    }

    const huesped = new Huesped(
      data.huesped.id,
      data.huesped.tipoDoc,
      data.huesped.nroDoc,
      data.huesped.nombres,
      data.huesped.apellidos,
      data.huesped.email,
      data.huesped.telefono,
      data.huesped.nacionalidad,
      data.huesped.observacion,
      data.huesped.createdAt,
      data.huesped.updatedAt,
    );

    const tipoHabitacion = new TipoHabitacion(
      data.habitacion.tipo.id,
      data.habitacion.tipo.nombre,
      data.habitacion.tipo.descripcion,
      data.habitacion.tipo.createdAt,
      data.habitacion.tipo.updatedAt,
    );

    const habitacion = new Habitacion(
      data.habitacion.id,
      data.habitacion.nroHabitacion,
      data.habitacion.tipoHabitacionId,
      tipoHabitacion,
      data.habitacion.piso,
      data.habitacion.tieneDucha,
      data.habitacion.tieneBanio,
      data.habitacion.urlImagen,
      data.habitacion.estado,
      data.habitacion.notas,
      data.habitacion.ultiLimpieza,
      data.habitacion.createdAt,
      data.habitacion.updatedAt,
    );

    const tipoHab = new TipoHabitacion(
      data.tarifa.tipoHabitacion.id,
      data.tarifa.tipoHabitacion.nombre,
      data.tarifa.tipoHabitacion.descripcion,
      data.tarifa.tipoHabitacion.createdAt,
      data.tarifa.tipoHabitacion.updatedAt,
    );

    const canal = new Canal(
      data.tarifa.canal.id,
      data.tarifa.canal.nombre,
      data.tarifa.canal.tipo,
      data.tarifa.canal.activo,
      data.tarifa.canal.notas,
      data.tarifa.canal.createdAt,
      data.tarifa.canal.updatedAt,
    );

    const tarifa = new Tarifa(
      data.tarifa.id,
      tipoHab,
      canal,
      Number(data.tarifa.precioNoche),
      data.tarifa.IVA ? Number(data.tarifa.IVA) : null,
      data.tarifa.cargoServicios ? Number(data.tarifa.cargoServicios) : null,
      data.tarifa.moneda,
      data.tarifa.createdAt,
      data.tarifa.updatedAt,
    );

    let pago: Pago | null = null;
    if (data.pago) {
      pago = new Pago(
        data.pago.id,
        data.pago.concepto,
        data.pago.estado,
        data.pago.fechaPago,
        Number(data.pago.monto),
        data.pago.moneda,
        data.pago.metodo,
        data.pago.recibidoPorId,
        data.pago.recibidoPor
          ? {
              id: data.pago.recibidoPor.id,
              name: data.pago.recibidoPor.name,
              email: data.pago.recibidoPor.email,
            }
          : null,
        data.pago.observacion,
        data.pago.createdAt,
      );
    }

    return new Reserva(
      data.id,
      data.codigo,
      huesped,
      habitacion,
      tarifa,
      pago,
      data.fechaEntrada,
      data.fechaSalida,
      data.adultos,
      data.ninos,
      data.nombreHuesped,
      data.nroHabitacion,
      data.nombreTipoHab,
      data.nombreCanal,
      Number(data.precioNoche),
      Number(data.IVA),
      Number(data.cargoServicios),
      Number(data.montoTotal),
      Number(data.montoDescuento),
      data.montoFinal ? Number(data.montoFinal) : null,
      data.estado as EstadoReserva,
      data.motivoCancel,
      data.canceladoEn,
      data.createdAt,
      data.updatedAt,
    );
  }
}
