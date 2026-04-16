import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import type {
  IFolioRepository,
  CreateFolioParams,
  UpdateFolioParams,
  FolioWithPromociones,
  FolioPaginationParams,
} from "../../domain/interfaces/folio.repository.interface";
import { DI_TOKENS } from "../../common/IoC/tokens";

function mapFolioWithPromociones(data: Record<string, unknown>): FolioWithPromociones {
  const promocionesRaw = data.promociones as Array<Record<string, unknown>> | undefined;
  const promociones = (promocionesRaw ?? []).map((p) => p.codigo as string);

  return {
    id: data.id as string,
    nroFolio: data.nroFolio as number,
    reservaId: data.reservaId as string,
    estado: data.estado as boolean,
    observacion: data.observacion as string | null,
    cerradoEn: data.cerradoEn as Date | null,
    createdAt: data.createdAt as Date,
    updatedAt: data.updatedAt as Date,
    promociones,
  };
}

@injectable()
export class FolioRepository implements IFolioRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(data: CreateFolioParams): Promise<FolioWithPromociones> {
    const result = await this.prisma.folio.create({
      data: {
        reservaId: data.reservaId,
        estado: data.estado ?? true,
        observacion: data.observacion ?? null,
        promociones: data.promocionIds
          ? { connect: data.promocionIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { promociones: { select: { codigo: true } } },
    });
    return mapFolioWithPromociones(result as unknown as Record<string, unknown>);
  }

  async findAll(): Promise<FolioWithPromociones[]> {
    const results = await this.prisma.folio.findMany({
      include: { promociones: { select: { codigo: true } } },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapFolioWithPromociones(r as unknown as Record<string, unknown>));
  }

  async findAllPaginated(params: FolioPaginationParams): Promise<{ list: FolioWithPromociones[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } }> {
    const { page = 1, limit = 10, reservaId, estado } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (reservaId) where.reservaId = reservaId;
    if (estado !== undefined) where.estado = estado;

    const [results, total] = await Promise.all([
      this.prisma.folio.findMany({
        where,
        include: { promociones: { select: { codigo: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.folio.count({ where }),
    ]);

    const list = results.map((r) => mapFolioWithPromociones(r as unknown as Record<string, unknown>));
    const totalPages = Math.ceil(total / limit);

    return {
      list,
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

  async findById(id: string): Promise<FolioWithPromociones | null> {
    const result = await this.prisma.folio.findUnique({
      where: { id },
      include: { promociones: { select: { codigo: true } } },
    });
    return result ? mapFolioWithPromociones(result as unknown as Record<string, unknown>) : null;
  }

  async findByReservaId(reservaId: string): Promise<FolioWithPromociones[]> {
    const results = await this.prisma.folio.findMany({
      where: { reservaId },
      include: { promociones: { select: { codigo: true } } },
      orderBy: { nroFolio: "asc" },
    });
    return results.map((r) => mapFolioWithPromociones(r as unknown as Record<string, unknown>));
  }

  async update(id: string, data: UpdateFolioParams): Promise<FolioWithPromociones> {
    const updateData: Record<string, unknown> = {};

    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.observacion !== undefined) updateData.observacion = data.observacion;
    if (data.promocionIds !== undefined) {
      updateData.promociones = {
        set: data.promocionIds.map((id) => ({ id })),
      };
    }

    const result = await this.prisma.folio.update({
      where: { id },
      data: updateData,
      include: { promociones: { select: { codigo: true } } },
    });
    return mapFolioWithPromociones(result as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.folio.delete({ where: { id } });
  }

  async close(id: string): Promise<FolioWithPromociones> {
    const result = await this.prisma.folio.update({
      where: { id },
      data: {
        estado: false,
        cerradoEn: new Date(),
      },
      include: { promociones: { select: { codigo: true } } },
    });
    return mapFolioWithPromociones(result as unknown as Record<string, unknown>);
  }
}