import { inject, injectable } from "tsyringe";
import { PrismaClient, Prisma } from "../../../generated/prisma/client";
import { Tarifa, CreateTarifaData } from "../../domain/entities/tarifa.entity";
import type { ITarifaRepository, UpdateTarifaData } from "../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../domain/exceptions/tarifa.exception";
import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import { Canal } from "../../domain/entities/canal.entity";
import { TarifaModel } from "../../../generated/prisma/models";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class TarifaRepository implements ITarifaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateTarifaData): Promise<Tarifa> {
    const result: TarifaModel = await this.prisma.tarifa.create({
      data: {
        tipoHabitacionId: data.tipoHabitacionId,
        canalId: data.canalId,
        precioNoche: data.precioNoche,
        IVA: data.IVA ?? null,
        cargoServicios: data.cargoServicios ?? null,
        moneda: data.moneda ?? "USD",
      },
      include: {
        tipoHabitacion: true,
        canal: true,
      },
    });
    return this.toDomain(result);
  }

  async findAll(): Promise<Tarifa[]> {
    const results = await this.prisma.tarifa.findMany({
      include: {
        tipoHabitacion: true,
        canal: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Tarifa | null> {
    const result = await this.prisma.tarifa.findUnique({
      where: { id },
      include: {
        tipoHabitacion: true,
        canal: true,
      },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateTarifaData): Promise<Tarifa> {
    try {
      const updateData: any = {};
      if (data.tipoHabitacionId !== undefined) updateData.tipoHabitacionId = data.tipoHabitacionId;
      if (data.canalId !== undefined) updateData.canalId = data.canalId;
      if (data.precioNoche !== undefined) updateData.precioNoche = data.precioNoche;
      if (data.IVA !== undefined) updateData.IVA = data.IVA;
      if (data.cargoServicios !== undefined) updateData.cargoServicios = data.cargoServicios;
      if (data.moneda !== undefined) updateData.moneda = data.moneda;

      const result = await this.prisma.tarifa.update({
        where: { id },
        data: updateData,
        include: {
          tipoHabitacion: true,
          canal: true,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw TarifaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.tarifa.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw TarifaException.notFoundById();
        }
      }
      throw error;
    }
  }

  async hasRelatedRecords(id: string): Promise<boolean> {
    const reservasCount = await this.prisma.reserva.count({
      where: { tarifaId: id },
    });
    return reservasCount > 0;
  }

  async findByTipoHabitacionAndCanal(tipoHabitacionId: string, canalId: string): Promise<Tarifa[]> {
    const results = await this.prisma.tarifa.findMany({
      where: {
        tipoHabitacionId,
        canalId,
      },
      include: {
        tipoHabitacion: true,
        canal: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async tipoHabitacionExists(id: string): Promise<boolean> {
    const count = await this.prisma.tipoHabitacion.count({
      where: { id },
    });
    return count > 0;
  }

  async canalExists(id: string): Promise<boolean> {
    const count = await this.prisma.canal.count({
      where: { id },
    });
    return count > 0;
  }

  private toDomain(data: any): Tarifa {
    if (!data.tipoHabitacion || !data.canal) {
      throw new Error("Tarifa must include tipoHabitacion and canal relations");
    }

    const tipoHabitacion = new TipoHabitacion(
      data.tipoHabitacion.id,
      data.tipoHabitacion.nombre,
      data.tipoHabitacion.descripcion,
      data.tipoHabitacion.createdAt,
      data.tipoHabitacion.updatedAt,
    );

    const canal = new Canal(
      data.canal.id,
      data.canal.nombre,
      data.canal.tipo,
      data.canal.activo,
      data.canal.notas,
      data.canal.createdAt,
      data.canal.updatedAt,
    );

    return new Tarifa(
      data.id,
      tipoHabitacion,
      canal,
      Number(data.precioNoche),
      data.IVA ? Number(data.IVA) : null,
      data.cargoServicios ? Number(data.cargoServicios) : null,
      data.moneda,
      data.createdAt,
      data.updatedAt,
    );
  }
}
