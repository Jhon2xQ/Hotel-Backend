import { PrismaClient } from "../../../generated/prisma/client";
import { Prisma } from "../../../generated/prisma/client";
import {
  Habitation,
  HabitationType,
  HabitationStatus,
  CreateHabitationData,
} from "../../domain/entities/habitation.entity";
import { IHabitationRepository, UpdateHabitationData } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";

export class HabitationRepository implements IHabitationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateHabitationData): Promise<Habitation> {
    try {
      const result = await this.prisma.habitacion.create({
        data: {
          numero: data.numero,
          piso: data.piso,
          tipo: data.tipo,
          precio: data.precio ?? null,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw HabitationException.duplicateNumero(data.numero);
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Habitation[]> {
    const results = await this.prisma.habitacion.findMany({
      orderBy: { numero: "asc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Habitation | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async findByNumero(numero: string): Promise<Habitation | null> {
    const result = await this.prisma.habitacion.findUnique({
      where: { numero },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateHabitationData): Promise<Habitation> {
    try {
      const updateData: any = {};

      if (data.numero !== undefined) updateData.numero = data.numero;
      if (data.piso !== undefined) updateData.piso = data.piso;
      if (data.tipo !== undefined) updateData.tipo = data.tipo;
      if (data.precio !== undefined) updateData.precio = data.precio ?? null;
      if (data.estado !== undefined) updateData.estado = data.estado;

      const result = await this.prisma.habitacion.update({
        where: { id },
        data: updateData,
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw HabitationException.duplicateNumero(data.numero!);
        }
        if (error.code === "P2025") {
          throw HabitationException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.habitacion.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw HabitationException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  private toDomain(data: any): Habitation {
    return new Habitation(
      data.id,
      data.numero,
      data.piso,
      data.tipo as HabitationType,
      data.precio ? Number(data.precio) : null,
      data.estado as HabitationStatus,
      data.created_at,
      data.updated_at,
    );
  }
}
