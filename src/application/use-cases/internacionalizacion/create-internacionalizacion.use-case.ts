import { inject, injectable } from "tsyringe";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { CreateInternacionalizacionDto, InternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { toInternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateInternacionalizacionUseCase {
  constructor(
    @inject(DI_TOKENS.IInternacionalizacionRepository) private repository: IInternacionalizacionRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

  async execute(habitacionId: string, input: CreateInternacionalizacionDto): Promise<InternacionalizacionDto> {
    const internacionalizacion = await this.repository.create({
      habitacionId,
      descripcionEn: input.descripcion_en ?? null,
      descripcionFr: input.descripcion_fr ?? null,
      featureEn: input.feature_en ?? null,
      featureFr: input.feature_fr ?? null,
      amenitiesEn: input.amenities_en ?? null,
      amenitiesFr: input.amenities_fr ?? null,
    });

    const habitacion = await this.habitacionRepository.findById(habitacionId);
    return toInternacionalizacionDto(internacionalizacion, habitacion!.id, habitacion!.nroHabitacion);
  }
}