import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import type {
  IFolioRepository,
  CreateFolioParams,
  UpdateFolioParams,
  FolioWithRelations,
  FolioPaginationParams,
  CreateFolioProductoParams,
  CreateFolioServicioParams,
} from "../../domain/interfaces/folio.repository.interface";
import { DI_TOKENS } from "../../common/IoC/tokens";
import { FolioProducto } from "../../domain/entities/folio-producto.entity";
import { FolioServicio } from "../../domain/entities/folio-servicio.entity";

function mapFolio(data: Record<string, unknown>): FolioWithRelations {
  const promocionesRaw = data.promociones as Array<Record<string, unknown>> | undefined;
  const promociones = (promocionesRaw ?? []).map((p) => p.codigo as string);

  return {
    id: data.id as string,
    codigo: data.codigo as string,
    estanciaId: data.estanciaId as string,
    pagoId: data.pagoId as string | null,
    estado: data.estado as boolean,
    observacion: data.observacion as string | null,
    cerradoEn: data.cerradoEn as Date | null,
    createdAt: data.createdAt as Date,
    updatedAt: data.updatedAt as Date,
    promociones,
  };
}

function mapFolioProducto(data: Record<string, unknown>): FolioProducto {
  return new FolioProducto(
    data.id as string,
    data.folioId as string,
    data.productoId as string,
    data.cantidad as number,
    Number(data.precioUnit),
    Number(data.total),
    data.createdAt as Date,
    data.updatedAt as Date,
  );
}

function mapFolioServicio(data: Record<string, unknown>): FolioServicio {
  return new FolioServicio(
    data.id as string,
    data.folioId as string,
    data.concepto as string,
    data.cantidad as number,
    Number(data.precioUnit),
    Number(data.total),
    data.createdAt as Date,
    data.updatedAt as Date,
  );
}

async function generateFolioCodigo(prisma: PrismaClient): Promise<string> {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const fechaPrefijo = `${yy}${mm}${dd}`;

  const ultimoFolio = await prisma.folio.findFirst({
    where: {
      codigo: { startsWith: `FOL-${fechaPrefijo}` },
    },
    orderBy: { codigo: "desc" },
  });

  let siguiente = 1;
  if (ultimoFolio) {
    const partes = ultimoFolio.codigo.split("-");
    const ultimoNumero = parseInt(partes[partes.length - 1], 10);
    if (!isNaN(ultimoNumero)) {
      siguiente = ultimoNumero + 1;
    }
  }

  return `FOL-${fechaPrefijo}-${siguiente}`;
}

@injectable()
export class FolioRepository implements IFolioRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(data: CreateFolioParams): Promise<FolioWithRelations> {
    const codigo = await generateFolioCodigo(this.prisma);

    const result = await this.prisma.folio.create({
      data: {
        codigo,
        estanciaId: data.estanciaId,
        estado: data.estado ?? true,
        observacion: data.observacion ?? null,
        promociones: data.promocionIds
          ? { connect: data.promocionIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { promociones: { select: { codigo: true } } },
    });
    return mapFolio(result as unknown as Record<string, unknown>);
  }

  async findAll(): Promise<FolioWithRelations[]> {
    const results = await this.prisma.folio.findMany({
      include: { promociones: { select: { codigo: true } } },
      orderBy: { createdAt: "desc" },
    });
    return results.map((r) => mapFolio(r as unknown as Record<string, unknown>));
  }

  async findAllPaginated(
    params: FolioPaginationParams,
  ): Promise<{
    list: FolioWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const { page = 1, limit = 10, estanciaId, estado } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (estanciaId) where.estanciaId = estanciaId;
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

    const list = results.map((r) => mapFolio(r as unknown as Record<string, unknown>));
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

  async findById(id: string): Promise<FolioWithRelations | null> {
    const result = await this.prisma.folio.findUnique({
      where: { id },
      include: { promociones: { select: { codigo: true } } },
    });
    return result ? mapFolio(result as unknown as Record<string, unknown>) : null;
  }

  async findByEstanciaId(estanciaId: string): Promise<FolioWithRelations[]> {
    const results = await this.prisma.folio.findMany({
      where: { estanciaId },
      include: { promociones: { select: { codigo: true } } },
      orderBy: { createdAt: "asc" },
    });
    return results.map((r) => mapFolio(r as unknown as Record<string, unknown>));
  }

  async findByCodigo(codigo: string): Promise<FolioWithRelations | null> {
    const result = await this.prisma.folio.findUnique({
      where: { codigo },
      include: { promociones: { select: { codigo: true } } },
    });
    return result ? mapFolio(result as unknown as Record<string, unknown>) : null;
  }

  async findOpenByEstanciaId(estanciaId: string): Promise<FolioWithRelations | null> {
    const result = await this.prisma.folio.findFirst({
      where: {
        estanciaId,
        estado: true,
      },
      include: { promociones: { select: { codigo: true } } },
      orderBy: { createdAt: "desc" },
    });
    return result ? mapFolio(result as unknown as Record<string, unknown>) : null;
  }

  async update(id: string, data: UpdateFolioParams): Promise<FolioWithRelations> {
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
    return mapFolio(result as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.folio.delete({ where: { id } });
  }

  async addProducto(data: CreateFolioProductoParams): Promise<FolioProducto> {
    const total = data.cantidad * data.precioUnit;

    const [folioProducto] = await this.prisma.$transaction([
      this.prisma.folioProducto.create({
        data: {
          folioId: data.folioId,
          productoId: data.productoId,
          cantidad: data.cantidad,
          precioUnit: data.precioUnit,
          total,
        },
      }),
      this.prisma.producto.update({
        where: { id: data.productoId },
        data: { stock: { decrement: data.cantidad } },
      }),
    ]);

    return mapFolioProducto(folioProducto as unknown as Record<string, unknown>);
  }

  async addServicio(data: CreateFolioServicioParams): Promise<FolioServicio> {
    const total = data.cantidad * data.precioUnit;

    const folioServicio = await this.prisma.folioServicio.create({
      data: {
        folioId: data.folioId,
        concepto: data.concepto,
        cantidad: data.cantidad,
        precioUnit: data.precioUnit,
        total,
      },
    });

    return mapFolioServicio(folioServicio as unknown as Record<string, unknown>);
  }

  async getConsumos(
    folioId: string,
  ): Promise<{ productos: FolioProducto[]; servicios: FolioServicio[] }> {
    const [productos, servicios] = await Promise.all([
      this.prisma.folioProducto.findMany({
        where: { folioId },
        orderBy: { createdAt: "asc" },
      }),
      this.prisma.folioServicio.findMany({
        where: { folioId },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    return {
      productos: productos.map((p) => mapFolioProducto(p as unknown as Record<string, unknown>)),
      servicios: servicios.map((s) => mapFolioServicio(s as unknown as Record<string, unknown>)),
    };
  }

  async getTotal(folioId: string): Promise<number> {
    const [productos, servicios] = await Promise.all([
      this.prisma.folioProducto.aggregate({
        where: { folioId },
        _sum: { total: true },
      }),
      this.prisma.folioServicio.aggregate({
        where: { folioId },
        _sum: { total: true },
      }),
    ]);

    const totalProductos = Number(productos._sum.total ?? 0);
    const totalServicios = Number(servicios._sum.total ?? 0);

    return totalProductos + totalServicios;
  }

  async closeWithPago(id: string, pagoId: string): Promise<FolioWithRelations> {
    const result = await this.prisma.folio.update({
      where: { id },
      data: {
        estado: false,
        cerradoEn: new Date(),
        pagoId,
      },
      include: { promociones: { select: { codigo: true } } },
    });
    return mapFolio(result as unknown as Record<string, unknown>);
  }
}
