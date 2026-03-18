import { PrismaClient } from "../../../generated/prisma/client";
import { Huesped, CreateHuespedData } from "../../domain/entities/huesped.entity";
import { IHuespedRepository, UpdateHuespedData } from "../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../domain/exceptions/huesped.exception";

export class HuespedRepository implements IHuespedRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateHuespedData): Promise<Huesped> {
    const existing = await this.prisma.huesped.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw HuespedException.duplicateEmail(data.email);
    }

    const huesped = await this.prisma.huesped.create({
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        nacionalidad: data.nacionalidad,
        nivelVip: data.nivelVip ?? 0,
        notas: data.notas ?? null,
      },
    });

    return new Huesped(
      huesped.id,
      huesped.nombres,
      huesped.apellidos,
      huesped.email,
      huesped.telefono,
      huesped.nacionalidad,
      huesped.nivelVip,
      huesped.notas,
      huesped.createdAt,
      huesped.updatedAt,
    );
  }

  async findAll(): Promise<Huesped[]> {
    const huespedes = await this.prisma.huesped.findMany({
      orderBy: { createdAt: "desc" },
    });

    return huespedes.map(
      (h) =>
        new Huesped(
          h.id,
          h.nombres,
          h.apellidos,
          h.email,
          h.telefono,
          h.nacionalidad,
          h.nivelVip,
          h.notas,
          h.createdAt,
          h.updatedAt,
        ),
    );
  }

  async findById(id: string): Promise<Huesped | null> {
    const huesped = await this.prisma.huesped.findUnique({
      where: { id },
    });

    if (!huesped) {
      return null;
    }

    return new Huesped(
      huesped.id,
      huesped.nombres,
      huesped.apellidos,
      huesped.email,
      huesped.telefono,
      huesped.nacionalidad,
      huesped.nivelVip,
      huesped.notas,
      huesped.createdAt,
      huesped.updatedAt,
    );
  }

  async update(id: string, data: UpdateHuespedData): Promise<Huesped> {
    const existing = await this.prisma.huesped.findUnique({
      where: { id },
    });

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.prisma.huesped.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw HuespedException.duplicateEmail(data.email);
      }
    }

    const updated = await this.prisma.huesped.update({
      where: { id },
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        nacionalidad: data.nacionalidad,
        nivelVip: data.nivelVip,
        notas: data.notas,
      },
    });

    return new Huesped(
      updated.id,
      updated.nombres,
      updated.apellidos,
      updated.email,
      updated.telefono,
      updated.nacionalidad,
      updated.nivelVip,
      updated.notas,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.huesped.findUnique({
      where: { id },
    });

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    await this.prisma.huesped.delete({
      where: { id },
    });
  }
}
