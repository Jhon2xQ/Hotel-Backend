import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Tarifa } from "../../domain/entities/tarifa.entity";
import type {
  ITarifaRepository,
  CreateTarifaParams,
  UpdateTarifaParams,
} from "../../domain/interfaces/tarifa.repository.interface";
import { mapTarifaFromPrisma } from "../mappers/tarifa.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

const includeRelations = {
  tipoHabitacion: true,
  canal: true,
} as const;

@injectable()
export class TarifaRepository implements ITarifaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateTarifaParams): Promise<Tarifa> {
    const result = await this.prisma.tarifa.create({
      data: {
        tipoHabitacionId: data.tipoHabitacionId,
        canalId: data.canalId,
        precio: data.precio,
        unidad: data.unidad ?? "dia",
        IVA: data.IVA ?? null,
        cargoServicios: data.cargoServicios ?? null,
        moneda: data.moneda ?? "USD",
      },
      include: includeRelations,
    });
    return mapTarifaFromPrisma(result);
  }

  async findAll(): Promise<Tarifa[]> {
    const results = await this.prisma.tarifa.findMany({
      include: includeRelations,
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapTarifaFromPrisma(r));
  }

  async findById(id: string): Promise<Tarifa | null> {
    const result = await this.prisma.tarifa.findUnique({
      where: { id },
      include: includeRelations,
    });
    return result ? mapTarifaFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateTarifaParams): Promise<Tarifa> {
    const updateData: Record<string, unknown> = {};
    if (data.tipoHabitacionId !== undefined) updateData.tipoHabitacionId = data.tipoHabitacionId;
    if (data.canalId !== undefined) updateData.canalId = data.canalId;
    if (data.precio !== undefined) updateData.precio = data.precio;
    if (data.unidad !== undefined) updateData.unidad = data.unidad;
    if (data.IVA !== undefined) updateData.IVA = data.IVA;
    if (data.cargoServicios !== undefined) updateData.cargoServicios = data.cargoServicios;
    if (data.moneda !== undefined) updateData.moneda = data.moneda;

    const result = await this.prisma.tarifa.update({
      where: { id },
      data: updateData,
      include: includeRelations,
    });
    return mapTarifaFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tarifa.delete({ where: { id } });
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const reservasCount = await this.prisma.reserva.count({
      where: { tarifaId: id },
    });
    return reservasCount > 0;
  }

  async findByTipoHabitacionAndCanal(tipoHabitacionId: string, canalId: string): Promise<Tarifa[]> {
    const results = await this.prisma.tarifa.findMany({
      where: { tipoHabitacionId, canalId },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapTarifaFromPrisma(r));
  }

  async tipoHabitacionExists(id: string): Promise<boolean> {
    const count = await this.prisma.tipoHabitacion.count({ where: { id } });
    return count > 0;
  }

  async canalExists(id: string): Promise<boolean> {
    const count = await this.prisma.canal.count({ where: { id } });
    return count > 0;
  }
}
