import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Promocion } from "../../domain/entities/promocion.entity";
import type {
  IPromocionRepository,
  CreatePromocionParams,
  UpdatePromocionParams,
  PromocionWithHabitaciones,
} from "../../domain/interfaces/promocion.repository.interface";
import { DI_TOKENS } from "../../common/IoC/tokens";

function mapPromocionWithHabitaciones(data: Record<string, unknown>): PromocionWithHabitaciones {
  const habitacionesRaw = data.habitaciones as Array<Record<string, unknown>> | undefined;
  const habitaciones = (habitacionesRaw ?? []).map((h) => h.id as string);

  return {
    id: data.id as string,
    codigo: data.codigo as string,
    tipoDescuento: data.tipoDescuento as string,
    valorDescuento: Number(data.valorDescuento),
    vigDesde: data.vigDesde as Date,
    vigHasta: data.vigHasta as Date,
    estado: data.estado as boolean,
    createdAt: data.createdAt as Date,
    updatedAt: data.updatedAt as Date,
    habitaciones,
  };
}

@injectable()
export class PromocionRepository implements IPromocionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(data: CreatePromocionParams): Promise<PromocionWithHabitaciones> {
    const result = await this.prisma.promocion.create({
      data: {
        codigo: data.codigo,
        tipoDescuento: data.tipoDescuento as "PORCENTAJE" | "MONTO_FIJO",
        valorDescuento: data.valorDescuento,
        vigDesde: data.vigDesde,
        vigHasta: data.vigHasta,
        estado: data.estado ?? true,
        habitaciones: data.habitaciones
          ? { connect: data.habitaciones.map((id) => ({ id })) }
          : undefined,
      },
      include: { habitaciones: { select: { id: true } } },
    });
    return mapPromocionWithHabitaciones(result as unknown as Record<string, unknown>);
  }

  async findAll(): Promise<PromocionWithHabitaciones[]> {
    const results = await this.prisma.promocion.findMany({
      include: { habitaciones: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapPromocionWithHabitaciones(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<PromocionWithHabitaciones | null> {
    const result = await this.prisma.promocion.findUnique({
      where: { id },
      include: { habitaciones: { select: { id: true } } },
    });
    return result ? mapPromocionWithHabitaciones(result as unknown as Record<string, unknown>) : null;
  }

  async findByCodigo(codigo: string): Promise<PromocionWithHabitaciones | null> {
    const result = await this.prisma.promocion.findUnique({
      where: { codigo },
      include: { habitaciones: { select: { id: true } } },
    });
    return result ? mapPromocionWithHabitaciones(result as unknown as Record<string, unknown>) : null;
  }

  async findByCodigos(codigos: string[]): Promise<Promocion[]> {
    if (codigos.length === 0) return [];
    const results = await this.prisma.promocion.findMany({
      where: { codigo: { in: codigos } },
    });
    return results.map((r) => new Promocion(r.id, r.codigo, r.tipoDescuento, Number(r.valorDescuento), r.vigDesde, r.vigHasta, r.estado, r.createdAt, r.updatedAt));
  }

  async findByIds(ids: string[]): Promise<Promocion[]> {
    if (ids.length === 0) return [];
    const results = await this.prisma.promocion.findMany({
      where: { id: { in: ids } },
    });
    return results.map((r) => new Promocion(r.id, r.codigo, r.tipoDescuento, Number(r.valorDescuento), r.vigDesde, r.vigHasta, r.estado, r.createdAt, r.updatedAt));
  }

  async update(id: string, data: UpdatePromocionParams): Promise<PromocionWithHabitaciones> {
    const updateData: Record<string, unknown> = {};
    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.tipoDescuento !== undefined) updateData.tipoDescuento = data.tipoDescuento;
    if (data.valorDescuento !== undefined) updateData.valorDescuento = data.valorDescuento;
    if (data.vigDesde !== undefined) updateData.vigDesde = data.vigDesde;
    if (data.vigHasta !== undefined) updateData.vigHasta = data.vigHasta;
    if (data.estado !== undefined) updateData.estado = data.estado;

    if (data.habitaciones !== undefined) {
      updateData.habitaciones = {
        set: data.habitaciones.map((hid) => ({ id: hid })),
      };
    }

    const result = await this.prisma.promocion.update({
      where: { id },
      data: updateData,
      include: { habitaciones: { select: { id: true } } },
    });
    return mapPromocionWithHabitaciones(result as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.promocion.delete({ where: { id } });
  }
}
