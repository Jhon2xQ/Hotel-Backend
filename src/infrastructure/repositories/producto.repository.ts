import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Producto } from "../../domain/entities/producto.entity";
import type {
  IProductoRepository,
  CreateProductoParams,
  UpdateProductoParams,
} from "../../domain/interfaces/producto.repository.interface";
import { mapProductoFromPrisma } from "../mappers/producto.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class ProductoRepository implements IProductoRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateProductoParams): Promise<Producto> {
    const result = await this.prisma.producto.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        precioUnitario: data.precioUnitario,
        stock: data.stock ?? 0,
      },
    });
    return mapProductoFromPrisma(result);
  }

  async findAll(): Promise<Producto[]> {
    const results = await this.prisma.producto.findMany({
      orderBy: { nombre: "asc" },
    });
    return results.map((r) => mapProductoFromPrisma(r));
  }

  async findById(id: string): Promise<Producto | null> {
    const result = await this.prisma.producto.findUnique({
      where: { id },
    });
    return result ? mapProductoFromPrisma(result) : null;
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    const result = await this.prisma.producto.findUnique({
      where: { codigo },
    });
    return result ? mapProductoFromPrisma(result) : null;
  }

  async findAllPaginated(params: {
    page: number;
    limit: number;
  }): Promise<{ list: Producto[]; pagination: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean } }> {
    const skip = (params.page - 1) * params.limit;

    const [results, total] = await Promise.all([
      this.prisma.producto.findMany({
        skip,
        take: params.limit,
        orderBy: { nombre: "asc" },
      }),
      this.prisma.producto.count(),
    ]);

    const totalPages = Math.ceil(total / params.limit);

    return {
      list: results.map((r) => mapProductoFromPrisma(r)),
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      },
    };
  }

  async update(id: string, data: UpdateProductoParams): Promise<Producto> {
    const updateData: Record<string, unknown> = {};

    if (data.codigo !== undefined) updateData.codigo = data.codigo;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;
    if (data.precioUnitario !== undefined) updateData.precioUnitario = data.precioUnitario;
    if (data.stock !== undefined) updateData.stock = data.stock;

    const result = await this.prisma.producto.update({
      where: { id },
      data: updateData,
    });
    return mapProductoFromPrisma(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.producto.delete({
      where: { id },
    });
  }
}