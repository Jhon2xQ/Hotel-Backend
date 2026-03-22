import { PrismaClient } from "../../../generated/prisma/client";
import { CategoriaMueble, CreateCategoriaMuebleData } from "../../domain/entities/categoria-mueble.entity";
import { ICategoriaMuebleRepository, UpdateCategoriaMuebleData } from "../../domain/interfaces/categoria-mueble.repository.interface";

export class CategoriaMuebleRepository implements ICategoriaMuebleRepository {
    constructor(
        private readonly prisma: PrismaClient,
    ) {}

    async create(data: CreateCategoriaMuebleData): Promise<CategoriaMueble> {
        const result = await this.prisma.categoriaMueble.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                activo: data.activo ?? true,
            },
        });
        return new CategoriaMueble(
            result.id,
            result.nombre,
            result.descripcion,
            result.activo,
            result.createdAt,
            result.updatedAt,
        );

    }

    async findAll(): Promise<CategoriaMueble[]> {
        const results = await this.prisma.categoriaMueble.findMany({
            orderBy: { createdAt: "desc" },
        });
        return results.map(
            (h) => 
            new CategoriaMueble(
                h.id,
                h.nombre,
                h.descripcion,
                h.activo,
                h.createdAt,
                h.updatedAt,
            )
        );
    }

    async findById(id: string): Promise<CategoriaMueble | null> {
        const result = await this.prisma.categoriaMueble.findUnique({
            where: { id },
        });
        if (!result) {
            return null;
        }
        return new CategoriaMueble(
            result.id,
            result.nombre,
            result.descripcion,
            result.activo,
            result.createdAt,
            result.updatedAt,
        );
    }

    async update(id: string, data: UpdateCategoriaMuebleData): Promise<CategoriaMueble> {
        const result = await this.prisma.categoriaMueble.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                activo: data.activo,
            },
        });
        return new CategoriaMueble(
            result.id,
            result.nombre,
            result.descripcion,
            result.activo,
            result.createdAt,
            result.updatedAt,
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.categoriaMueble.delete({
            where: { id },
        });
    }
            
}