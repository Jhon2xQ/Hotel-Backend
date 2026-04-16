import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { InsumoBar, MovimientoBar } from "../../domain/entities/insumo-bar.entity";
import type {
  IInsumoBarRepository,
  CreateInsumoBarParams,
  UpdateInsumoBarParams,
  CreateMovimientoBarParams,
  MovimientoBarFilters,
} from "../../domain/interfaces/insumo-bar.repository.interface";
import { mapInsumoBarFromPrisma, mapMovimientoBarFromPrisma } from "../mappers/insumo-bar.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";
import { TipoMovimiento } from "../../domain/entities/insumo-bar.entity";

@injectable()
export class InsumoBarRepository implements IInsumoBarRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateInsumoBarParams): Promise<InsumoBar> {
    const result = await this.prisma.insumoBar.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        unidad: data.unidad as any,
        stockActual: data.stockActual ?? 0,
        stockMinimo: data.stockMinimo ?? 0,
        notas: data.notas ?? null,
      },
    });
    return mapInsumoBarFromPrisma(result);
  }

  async findAll(): Promise<InsumoBar[]> {
    const results = await this.prisma.insumoBar.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
    return results.map(mapInsumoBarFromPrisma);
  }

  async findById(id: string): Promise<InsumoBar | null> {
    const result = await this.prisma.insumoBar.findUnique({
      where: { id },
    });
    return result ? mapInsumoBarFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<InsumoBar | null> {
    const result = await this.prisma.insumoBar.findUnique({
      where: { codigo },
    });
    return result ? mapInsumoBarFromPrisma(result) : null;
  }

  async update(id: string, data: UpdateInsumoBarParams): Promise<InsumoBar> {
    const updateData: Record<string, unknown> = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.unidad !== undefined) updateData.unidad = data.unidad;
    if (data.stockActual !== undefined) updateData.stockActual = data.stockActual;
    if (data.stockMinimo !== undefined) updateData.stockMinimo = data.stockMinimo;
    if (data.notas !== undefined) updateData.notas = data.notas ?? null;
    if (data.activo !== undefined) updateData.activo = data.activo;

    const result = await this.prisma.insumoBar.update({
      where: { id },
      data: updateData,
    });
    return mapInsumoBarFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.insumoBar.update({
      where: { id },
      data: { activo: false },
    });
  }

  async createMovimiento(data: CreateMovimientoBarParams): Promise<MovimientoBar> {
    const insumo = await this.prisma.insumoBar.findUnique({
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
      this.prisma.movimientoBar.create({
        data: {
          insumoId: data.insumoId,
          tipo: data.tipo as any,
          cantidad: data.cantidad,
          motivoEntrada: data.motivoEntrada ?? null,
          motivoSalida: data.motivoSalida ?? null,
          notas: data.notas ?? null,
        },
      }),
      this.prisma.insumoBar.update({
        where: { id: data.insumoId },
        data: { stockActual: nuevoStock },
      }),
    ]);

    return mapMovimientoBarFromPrisma(result);
  }

  async findMovimientos(filters: MovimientoBarFilters): Promise<MovimientoBar[]> {
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

    const results = await this.prisma.movimientoBar.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return results.map(mapMovimientoBarFromPrisma);
  }

  async findMovimientosByInsumo(insumoId: string): Promise<MovimientoBar[]> {
    const results = await this.prisma.movimientoBar.findMany({
      where: { insumoId },
      orderBy: { createdAt: "desc" },
    });
    return results.map(mapMovimientoBarFromPrisma);
  }
}