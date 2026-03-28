import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Huesped } from "../../domain/entities/huesped.entity";
import type {
  IHuespedRepository,
  CreateHuespedParams,
  UpdateHuespedParams,
} from "../../domain/interfaces/huesped.repository.interface";
import type { PaginatedResult, PaginationParams } from "../../common/types/pagination.types";
import { mapHuespedFromPrisma } from "../mappers/huesped.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class HuespedRepository implements IHuespedRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(data: CreateHuespedParams): Promise<Huesped> {
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
    return mapHuespedFromPrisma(huesped);
  }

  async findAll(): Promise<Huesped[]> {
    const huespedes = await this.prisma.huesped.findMany({
      orderBy: { createdAt: "desc" },
    });
    return huespedes.map((h) => mapHuespedFromPrisma(h));
  }

  async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Huesped>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [huespedes, total] = await Promise.all([
      this.prisma.huesped.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.huesped.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      list: huespedes.map((h) => mapHuespedFromPrisma(h)),
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
    const huesped = await this.prisma.huesped.findUnique({ where: { id } });
    return huesped ? mapHuespedFromPrisma(huesped) : null;
  }

  async findByEmail(email: string): Promise<Huesped | null> {
    const huesped = await this.prisma.huesped.findUnique({ where: { email } });
    return huesped ? mapHuespedFromPrisma(huesped) : null;
  }

  async update(id: string, data: UpdateHuespedParams): Promise<Huesped> {
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
    return mapHuespedFromPrisma(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.huesped.delete({ where: { id } });
  }
}
