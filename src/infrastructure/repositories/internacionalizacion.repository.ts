import { inject, injectable } from "tsyringe";
import { PrismaClient } from "../../../generated/prisma/client";
import { Internacionalizacion } from "../../domain/entities/internacionalizacion.entity";
import type {
  IInternacionalizacionRepository,
  CreateInternacionalizacionParams,
  UpdateInternacionalizacionParams,
} from "../../domain/interfaces/internacionalizacion.repository.interface";
import { mapInternacionalizacionFromPrisma } from "../mappers/internacionalizacion.mapper";
import { DI_TOKENS } from "../../common/IoC/tokens";

@injectable()
export class InternacionalizacionRepository implements IInternacionalizacionRepository {
  constructor(@inject(DI_TOKENS.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateInternacionalizacionParams): Promise<Internacionalizacion> {
    const result = await this.prisma.internacionalizacion.create({
      data: {
        habitacionId: data.habitacionId,
        descripcionEn: data.descripcionEn ?? null,
        descripcionFr: data.descripcionFr ?? null,
        featureEn: data.featureEn ?? null,
        featureFr: data.featureFr ?? null,
        amenitiesEn: data.amenitiesEn ?? null,
        amenitiesFr: data.amenitiesFr ?? null,
      },
    });
    return mapInternacionalizacionFromPrisma(result);
  }

  async findByHabitacionId(habitacionId: string): Promise<Internacionalizacion | null> {
    const result = await this.prisma.internacionalizacion.findUnique({
      where: { habitacionId },
    });
    return result ? mapInternacionalizacionFromPrisma(result) : null;
  }

  async update(habitacionId: string, data: UpdateInternacionalizacionParams): Promise<Internacionalizacion> {
    const updateData: Record<string, unknown> = {};

    if (data.descripcionEn !== undefined) updateData.descripcionEn = data.descripcionEn;
    if (data.descripcionFr !== undefined) updateData.descripcionFr = data.descripcionFr;
    if (data.featureEn !== undefined) updateData.featureEn = data.featureEn;
    if (data.featureFr !== undefined) updateData.featureFr = data.featureFr;
    if (data.amenitiesEn !== undefined) updateData.amenitiesEn = data.amenitiesEn;
    if (data.amenitiesFr !== undefined) updateData.amenitiesFr = data.amenitiesFr;

    const result = await this.prisma.internacionalizacion.update({
      where: { habitacionId },
      data: updateData,
    });
    return mapInternacionalizacionFromPrisma(result);
  }

  async delete(habitacionId: string): Promise<void> {
    await this.prisma.internacionalizacion.delete({
      where: { habitacionId },
    });
  }
}