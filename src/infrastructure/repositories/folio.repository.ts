import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import type {
  IFolioRepository,
  CreateFolioParams,
  UpdateFolioParams,
  FolioWithPromociones,
} from "../../domain/interfaces/folio.repository.interface";
import { DI_TOKENS } from "../../common/IoC/tokens";

function mapFolioWithPromociones(data: Record<string, unknown>): FolioWithPromociones {
  const promocionRaw = data.promocion as Array<Record<string, unknown>> | undefined;
  const promociones = (promocionRaw ?? []).map((pf) => {
    const promo = pf.promocion as Record<string, unknown> | undefined;
    return (promo?.codigo as string) ?? "";
  }).filter((c) => c !== "");

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
        promocion: data.promocionIds
          ? {
              create: data.promocionIds.map((promocionId) => ({ promocionId })),
            }
          : undefined,
      },
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
    });
    return mapFolioWithPromociones(result as unknown as Record<string, unknown>);
  }

  async findAll(): Promise<FolioWithPromociones[]> {
    const results = await this.prisma.folio.findMany({
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapFolioWithPromociones(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<FolioWithPromociones | null> {
    const result = await this.prisma.folio.findUnique({
      where: { id },
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
    });
    return result ? mapFolioWithPromociones(result as unknown as Record<string, unknown>) : null;
  }

  async findByReservaId(reservaId: string): Promise<FolioWithPromociones[]> {
    const results = await this.prisma.folio.findMany({
      where: { reservaId },
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
      orderBy: { nroFolio: "asc" },
    });
    return results.map((r) => mapFolioWithPromociones(r as unknown as Record<string, unknown>));
  }

  async update(id: string, data: UpdateFolioParams): Promise<FolioWithPromociones> {
    const updateData: Record<string, unknown> = {};

    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.observacion !== undefined) updateData.observacion = data.observacion;
    if (data.promocionIds !== undefined) {
      updateData.promocion = {
        deleteMany: {},
        create: data.promocionIds.map((promocionId) => ({ promocionId })),
      };
    }

    const result = await this.prisma.folio.update({
      where: { id },
      data: updateData,
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
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
      include: { promocion: { include: { promocion: { select: { codigo: true } } } } },
    });
    return mapFolioWithPromociones(result as unknown as Record<string, unknown>);
  }
}