import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { InsumoCocina, MovimientoCocina, TipoMovimiento } from "../../domain/entities/insumo-cocina.entity";
import type {
  IInsumoCocinaRepository,
  CreateInsumoCocinaParams,
  UpdateInsumoCocinaParams,
  CreateMovimientoCocinaParams,
  MovimientoCocinaFilters,
} from "../../domain/interfaces/insumo-cocina.repository.interface";
import { mapInsumoCocinaFromPrisma, mapMovimientoCocinaFromPrisma } from "../mappers/insumo-cocina.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class InsumoCocinaRepository implements IInsumoCocinaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateInsumoCocinaParams): Promise<InsumoCocina> {
    const result = await this.prisma.insumoCocina.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        unidad: data.unidad as any,
        stockActual: data.stockActual ?? 0,
        stockMinimo: data.stockMinimo ?? 0,
        notas: data.notas ?? null,
      },
    });
    return mapInsumoCocinaFromPrisma(result);
  }

  async findAll(): Promise<InsumoCocina[]> {
    const results = await this.prisma.insumoCocina.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
    return results.map(mapInsumoCocinaFromPrisma);
  }

  async findById(id: string): Promise<InsumoCocina | null> {
    const result = await this.prisma.insumoCocina.findUnique({
      where: { id },
    });
    return result ? mapInsumoCocinaFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<InsumoCocina | null> {
    const result = await this.prisma.insumoCocina.findUnique({
      where: { codigo },
    });
    return result ? mapInsumoCocinaFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateInsumoCocinaParams): Promise<InsumoCocina> {
    const updateData: Record<string, unknown> = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.unidad !== undefined) updateData.unidad = data.unidad;
    if (data.stockActual !== undefined) updateData.stockActual = data.stockActual;
    if (data.stockMinimo !== undefined) updateData.stockMinimo = data.stockMinimo;
    if (data.notas !== undefined) updateData.notas = data.notas ?? null;
    if (data.activo !== undefined) updateData.activo = data.activo;

    const result = await this.prisma.insumoCocina.update({
      where: { id },
      data: updateData,
    });
    return mapInsumoCocinaFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.insumoCocina.update({
      where: { id },
      data: { activo: false },
    });
  }

  async createMovimiento(data: CreateMovimientoCocinaParams): Promise<MovimientoCocina> {
    const insumo = await this.prisma.insumoCocina.findUnique({
      where: { id: data.insumoId },
    });

    if (!insumo) {
      throw new Error("Insumo no encontrado");
    }

    let nuevoStock = Number(insumo.stockActual);
    if (data.tipo === TipoMovimiento.Entrada) {
      nuevoStock += data.cantidad;
    } else if (data.tipo === TipoMovimiento.Salida) {
      nuevoStock -= data.cantidad;
      if (nuevoStock < 0) {
        throw new Error("Stock insuficiente");
      }
    }

    const [result] = await this.prisma.$transaction([
      this.prisma.movimientoCocina.create({
        data: {
          insumoId: data.insumoId,
          tipo: data.tipo as any,
          cantidad: data.cantidad,
          motivoEntrada: data.motivoEntrada ?? null,
          motivoSalida: data.motivoSalida ?? null,
          notas: data.notas ?? null,
        },
      }),
      this.prisma.insumoCocina.update({
        where: { id: data.insumoId },
        data: { stockActual: nuevoStock },
      }),
    ]);

    return mapMovimientoCocinaFromPrisma(result);
  }

  async findMovimientos(filters: MovimientoCocinaFilters): Promise<MovimientoCocina[]> {
    const where: Record<string, unknown> = {};

    if (filters.insumoId) {
      where.insumoId = filters.insumoId;
    }
    if (filters.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters.fechaInicio || filters.fechaFin) {
      where.createdAt = {};
      if (filters.fechaInicio) {
        (where.createdAt as Record<string, Date>).gte = filters.fechaInicio;
      }
      if (filters.fechaFin) {
        (where.createdAt as Record<string, Date>).lte = filters.fechaFin;
      }
    }

    const results = await this.prisma.movimientoCocina.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return results.map(mapMovimientoCocinaFromPrisma);
  }

  async findMovimientosByInsumo(insumoId: string): Promise<MovimientoCocina[]> {
    const results = await this.prisma.movimientoCocina.findMany({
      where: { insumoId },
      orderBy: { createdAt: "desc" },
    });
    return results.map(mapMovimientoCocinaFromPrisma);
  }
}