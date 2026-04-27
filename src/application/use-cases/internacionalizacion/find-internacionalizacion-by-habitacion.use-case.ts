import { inject, injectable } from "tsyringe";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { InternacionalizacionException } from "../../../domain/exceptions/internacionalizacion.exception";
import type { InternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { toInternacionalizacionDto } from "../../dtos/internacionalizacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindInternacionalizacionByHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.IInternacionalizacionRepository) private repository: IInternacionalizacionRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
  ) {}

  async execute(habitacionId: string): Promise<InternacionalizacionDto> {
    const internacionalizacion = await this.repository.findByHabitacionId(habitacionId);
    if (!internacionalizacion) {
      throw InternacionalizacionException.notFoundByHabitacionId();
    }

    const habitacion = await this.habitacionRepository.findById(habitacionId);
    if (!habitacion) {
      throw InternacionalizacionException.notFoundByHabitacionId();
    }

    return toInternacionalizacionDto(internacionalizacion, habitacion.id, habitacion.nroHabitacion);
  }
}