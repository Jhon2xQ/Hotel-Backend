import { PrismaClient } from "../../../generated/prisma/client";
import { Prisma } from "../../../generated/prisma/client";
import {
  FurnitureCatalog,
  FurnitureCategory,
  CreateFurnitureCatalogData,
} from "../../domain/entities/furniture-catalog.entity";
import {
  IFurnitureCatalogRepository,
  UpdateFurnitureCatalogData,
} from "../../domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../domain/exceptions/furniture-catalog.exception";

export class FurnitureCatalogRepository implements IFurnitureCatalogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateFurnitureCatalogData): Promise<FurnitureCatalog> {
    try {
      const result = await this.prisma.catalogoMueble.create({
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          categoria: data.categoria,
          descripcion: data.descripcion ?? null,
        },
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw FurnitureCatalogException.duplicateCodigo(data.codigo);
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<FurnitureCatalog[]> {
    const results = await this.prisma.catalogoMueble.findMany({
      orderBy: { nombre: "asc" },
    });
    return results.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<FurnitureCatalog | null> {
    const result = await this.prisma.catalogoMueble.findUnique({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async findByCodigo(codigo: string): Promise<FurnitureCatalog | null> {
    const result = await this.prisma.catalogoMueble.findUnique({
      where: { codigo },
    });
    return result ? this.toDomain(result) : null;
  }

  async update(id: string, data: UpdateFurnitureCatalogData): Promise<FurnitureCatalog> {
    try {
      const updateData: any = {};

      if (data.codigo !== undefined) updateData.codigo = data.codigo;
      if (data.nombre !== undefined) updateData.nombre = data.nombre;
      if (data.categoria !== undefined) updateData.categoria = data.categoria;
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion ?? null;

      const result = await this.prisma.catalogoMueble.update({
        where: { id },
        data: updateData,
      });
      return this.toDomain(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw FurnitureCatalogException.duplicateCodigo(data.codigo!);
        }
        if (error.code === "P2025") {
          throw FurnitureCatalogException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.catalogoMueble.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw FurnitureCatalogException.notFoundById(id);
        }
      }
      throw error;
    }
  }

  private toDomain(data: any): FurnitureCatalog {
    return new FurnitureCatalog(
      data.id,
      data.codigo,
      data.nombre,
      data.categoria as FurnitureCategory,
      data.descripcion,
      data.createdAt,
      data.updatedAt,
    );
  }
}
