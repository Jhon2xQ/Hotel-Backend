import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Promocion } from "../../domain/entities/promocion.entity";
import type {
  IPromocionRepository,
  CreatePromocionParams,
  UpdatePromocionParams,
  PromocionPaginationParams,
} from "../../domain/interfaces/promocion.repository.interface";
import type { PaginatedResult } from "../../application/paginations/api.pagination";
import { mapPromocionFromPrisma } from "../mappers/promocion.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class PromocionRepository implements IPromocionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(data: CreatePromocionParams): Promise<Promocion> {
    const result = await this.prisma.promocion.create({
      data: {
        codigo: data.codigo,
        tipoDescuento: data.tipoDescuento as "PORCENTAJE" | "MONTO_FIJO",
        valorDescuento: data.valorDescuento,
        vigDesde: data.vigDesde,
        vigHasta: data.vigHasta,
        estado: data.estado ?? true,
        habitaciones: data.habitacionIds
          ? { connect: data.habitacionIds.map((id) => ({ id })) }
          : undefined,
      },
    });
    return mapPromocionFromPrisma(result);
  }

  async findAll(params: PromocionPaginationParams): Promise<PaginatedResult<Promocion>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [promociones, total] = await Promise.all([
      this.prisma.promocion.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.promocion.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      list: promociones.map((p) => mapPromocionFromPrisma(p)),
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

  async findById(id: string): Promise<Promocion | null> {
    const result = await this.prisma.promocion.findUnique({ where: { id } });
    return result ? mapPromocionFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Promocion | null> {
    const result = await this.prisma.promocion.findUnique({ where: { codigo } });
    return result ? mapPromocionFromPrisma(result) : null;
  }

  async update(id: string, data: UpdatePromocionParams): Promise<Promocion> {
    const updateData: Record<string, unknown> = {};
    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.tipoDescuento !== undefined) updateData.tipoDescuento = data.tipoDescuento;
    if (data.valorDescuento !== undefined) updateData.valorDescuento = data.valorDescuento;
    if (data.vigDesde !== undefined) updateData.vigDesde = data.vigDesde;
    if (data.vigHasta !== undefined) updateData.vigHasta = data.vigHasta;
    if (data.estado !== undefined) updateData.estado = data.estado;

    if (data.habitacionIds !== undefined) {
      updateData.habitaciones = {
        set: data.habitacionIds.map((hid) => ({ id: hid })),
      };
    }

    const result = await this.prisma.promocion.update({
      where: { id },
      data: updateData,
    });
    return mapPromocionFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.promocion.delete({ where: { id } });
  }
}
