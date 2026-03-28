import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import {
  Pago,
  CreatePagoData,
  ConceptoPago,
  EstadoPago,
  MetodoPago,
  UserBasic,
} from "../../domain/entities/pago.entity";
import type { IPagoRepository, UpdatePagoData } from "../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../domain/exceptions/pago.exception";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class PagoRepository implements IPagoRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreatePagoData): Promise<Pago> {
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
    return this.toDomain(result);
  }

  async findAll(): Promise<Pago[]> {
    const results = await this.prisma.pago.findMany({
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Pago | null> {
    const result = await this.prisma.pago.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdatePagoData): Promise<Pago> {
    try {
      const updateData: any = {};

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
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw PagoException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.pago.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw PagoException.notFoundById();
        }
      }
      throw error;
    }
  }

  private toDomain(data: any): Pago {
    const recibidoPor: UserBasic | null = data.recibidoPor
      ? {
          id: data.recibidoPor.id,
          name: data.recibidoPor.name,
          email: data.recibidoPor.email,
        }
      : null;

    return new Pago(
      data.id,
      data.concepto as ConceptoPago,
      data.estado as EstadoPago,
      data.fechaPago,
      parseFloat(data.monto.toString()),
      data.moneda,
      data.metodo as MetodoPago,
      data.recibidoPorId,
      recibidoPor,
      data.observacion,
      data.createdAt,
    );
  }
}
