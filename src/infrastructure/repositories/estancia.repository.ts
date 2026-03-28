import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Estancia, EstadoEstadia } from "../../domain/entities/estancia.entity";
import type {
  IEstanciaRepository,
  CreateEstanciaParams,
  UpdateEstanciaParams,
} from "../../domain/interfaces/estancia.repository.interface";
import { mapEstanciaFromPrisma } from "../mappers/estancia.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class EstanciaRepository implements IEstanciaRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  private getIncludeRelations() {
    return {
      habitacion: { include: { tipo: true } },
      huesped: true,
    };
  }

  async create(data: CreateEstanciaParams): Promise<Estancia> {
    const result = await this.prisma.estancia.create({
      data: {
        reservaId: data.reservaId,
        habitacionId: data.habitacionId,
        huespedId: data.huespedId,
        fechaEntrada: data.fechaEntrada || new Date(),
        fechaSalida: data.fechaSalida ?? null,
        estado: data.estado ?? EstadoEstadia.EN_CASA,
        notas: data.notas ?? null,
      },
      include: this.getIncludeRelations(),
    });
    return mapEstanciaFromPrisma(result);
  }

  async findAll(): Promise<Estancia[]> {
    const results = await this.prisma.estancia.findMany({
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapEstanciaFromPrisma(r));
  }

  async findById(id: string): Promise<Estancia | null> {
    const result = await this.prisma.estancia.findUnique({
      where: { id },
      include: this.getIncludeRelations(),
    });
    return result ? mapEstanciaFromPrisma(result) : null;
  }

  async findByReservaId(reservaId: string): Promise<Estancia[]> {
    const results = await this.prisma.estancia.findMany({
      where: { reservaId },
      include: this.getIncludeRelations(),
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapEstanciaFromPrisma(r));
  }

  async update(id: string, data: UpdateEstanciaParams): Promise<Estancia> {
    const updateData: Record<string, unknown> = {};
    if (data.reservaId !== undefined) updateData.reservaId = data.reservaId;
    if (data.habitacionId !== undefined) updateData.habitacionId = data.habitacionId;
    if (data.huespedId !== undefined) updateData.huespedId = data.huespedId;
    if (data.fechaEntrada !== undefined) updateData.fechaEntrada = data.fechaEntrada;
    if (data.fechaSalida !== undefined) updateData.fechaSalida = data.fechaSalida;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.notas !== undefined) updateData.notas = data.notas;

    const result = await this.prisma.estancia.update({
      where: { id },
      data: updateData,
      include: this.getIncludeRelations(),
    });
    return mapEstanciaFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.estancia.delete({ where: { id } });
  }

  async checkout(id: string, fechaSalida: Date): Promise<Estancia> {
    const result = await this.prisma.estancia.update({
      where: { id },
      data: { fechaSalida, estado: EstadoEstadia.COMPLETADA },
      include: this.getIncludeRelations(),
    });
    return mapEstanciaFromPrisma(result);
  }
}
