import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { Pago, EstadoPago } from "../../domain/entities/pago.entity";
import type { IPagoRepository, CreatePagoParams, UpdatePagoParams } from "../../domain/interfaces/pago.repository.interface";
import { mapPagoFromPrisma } from "../mappers/pago.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class PagoRepository implements IPagoRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreatePagoParams): Promise<Pago> {
    const result = await this.prisma.pago.create({
      data: {
        concepto: data.concepto,
        estado: data.estado ?? EstadoPago.CONFIRMADO,
        fechaPago: data.fechaPago ?? new Date(),
        monto: new Prisma.Decimal(data.monto),
        moneda: data.moneda ?? "SOL",
        metodo: data.metodo,
        recibidoPorId: data.recibidoPorId ?? null,
        observacion: data.observacion ?? null,
      },
    });
    return mapPagoFromPrisma(result);
  }

  async findAll(): Promise<Pago[]> {
    const results = await this.prisma.pago.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapPagoFromPrisma(r));
  }

  async findById(id: string): Promise<Pago | null> {
    const result = await this.prisma.pago.findUnique({ where: { id } });
    return result ? mapPagoFromPrisma(result) : null;
  }

  async update(id: string, data: UpdatePagoParams): Promise<Pago> {
    const updateData: Record<string, unknown> = {};
    if (data.concepto !== undefined) updateData.concepto = data.concepto;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.fechaPago !== undefined) updateData.fechaPago = data.fechaPago;
    if (data.monto !== undefined) updateData.monto = new Prisma.Decimal(data.monto);
    if (data.moneda !== undefined) updateData.moneda = data.moneda;
    if (data.metodo !== undefined) updateData.metodo = data.metodo;
    if (data.observacion !== undefined) updateData.observacion = data.observacion ?? null;

    const result = await this.prisma.pago.update({
      where: { id },
      data: updateData,
    });
    return mapPagoFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pago.delete({ where: { id } });
  }
}
