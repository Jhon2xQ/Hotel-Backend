import { PrismaClient } from "../../../generated/prisma/client";
import { Huesped, CreateHuespedData } from "../../domain/entities/huesped.entity";
import { IHuespedRepository, UpdateHuespedData } from "../../domain/interfaces/huesped.repository.interface";
import { PaginatedResult, PaginationParams } from "../../common/types/pagination.types";

export class HuespedRepository implements IHuespedRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateHuespedData): Promise<Huesped> {
    const huesped = await this.prisma.huesped.create({
      data: {
        tipoDoc: data.tipo_doc ?? null,
        nroDoc: data.nro_doc ?? null,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        nacionalidad: data.nacionalidad,
        observacion: data.observacion ?? null,
      },
    });

    return new Huesped(
      huesped.id,
      huesped.tipoDoc,
      huesped.nroDoc,
      huesped.nombres,
      huesped.apellidos,
      huesped.email,
      huesped.telefono,
      huesped.nacionalidad,
      huesped.observacion,
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
          h.tipoDoc,
          h.nroDoc,
          h.nombres,
          h.apellidos,
          h.email,
          h.telefono,
          h.nacionalidad,
          h.observacion,
          h.createdAt,
          h.updatedAt,
        ),
    );
  }

  async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Huesped>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [huespedes, total] = await Promise.all([
      this.prisma.huesped.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.huesped.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      list: huespedes.map(
        (h) =>
          new Huesped(
            h.id,
            h.tipoDoc,
            h.nroDoc,
            h.nombres,
            h.apellidos,
            h.email,
            h.telefono,
            h.nacionalidad,
            h.observacion,
            h.createdAt,
            h.updatedAt,
          ),
      ),
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

  async findById(id: string): Promise<Huesped | null> {
    const huesped = await this.prisma.huesped.findUnique({
      where: { id },
    });

    if (!huesped) {
      return null;
    }

    return new Huesped(
      huesped.id,
      huesped.tipoDoc,
      huesped.nroDoc,
      huesped.nombres,
      huesped.apellidos,
      huesped.email,
      huesped.telefono,
      huesped.nacionalidad,
      huesped.observacion,
      huesped.createdAt,
      huesped.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<Huesped | null> {
    const huesped = await this.prisma.huesped.findUnique({
      where: { email },
    });

    if (!huesped) {
      return null;
    }

    return new Huesped(
      huesped.id,
      huesped.tipoDoc,
      huesped.nroDoc,
      huesped.nombres,
      huesped.apellidos,
      huesped.email,
      huesped.telefono,
      huesped.nacionalidad,
      huesped.observacion,
      huesped.createdAt,
      huesped.updatedAt,
    );
  }

  async update(id: string, data: UpdateHuespedData): Promise<Huesped> {
    const updated = await this.prisma.huesped.update({
      where: { id },
      data: {
        tipoDoc: data.tipo_doc,
        nroDoc: data.nro_doc,
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        nacionalidad: data.nacionalidad,
        observacion: data.observacion,
      },
    });

    return new Huesped(
      updated.id,
      updated.tipoDoc,
      updated.nroDoc,
      updated.nombres,
      updated.apellidos,
      updated.email,
      updated.telefono,
      updated.nacionalidad,
      updated.observacion,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.huesped.delete({
      where: { id },
    });
  }
}
