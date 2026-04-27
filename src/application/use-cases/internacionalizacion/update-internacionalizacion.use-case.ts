import { inject, injectable } from "tsyringe";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { InternacionalizacionException } from "../../../domain/exceptions/internacionalizacion.exception";
import type { UpdateInternacionalizacionDto, InternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { toInternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateInternacionalizacionUseCase {
  constructor(
    @inject(DI_TOKENS.IInternacionalizacionRepository) private repository: IInternacionalizacionRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

  async execute(habitacionId: string, input: UpdateInternacionalizacionDto): Promise<InternacionalizacionDto> {
    const existing = await this.repository.findByHabitacionId(habitacionId);
    if (!existing) {
      throw InternacionalizacionException.notFoundByHabitacionId();
    }

    const habitacion = await this.habitacionRepository.findById(habitacionId);
    if (!habitacion) {
      throw InternacionalizacionException.notFoundByHabitacionId();
    }

    const updated = await this.repository.update(habitacionId, {
      descripcionEn: input.descripcion_en,
      descripcionFr: input.descripcion_fr,
      featureEn: input.feature_en,
      featureFr: input.feature_fr,
      amenitiesEn: input.amenities_en,
      amenitiesFr: input.amenities_fr,
    });

    return toInternacionalizacionDto(updated, habitacion.id, habitacion.nroHabitacion);
  }
}