import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { toPublicHabitacionWithMueblesDto, type PublicHabitacionWithMueblesDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionByIdWithPriceUseCase {
  constructor(
    @inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository,
    @inject(DI_TOKENS.IInternacionalizacionRepository)
    private internacionalizacionRepository: IInternacionalizacionRepository,
  ) {}

  async execute(id: string, locale: "es" | "en" | "fr" = "es"): Promise<PublicHabitacionWithMueblesDto> {
    const result = await this.repository.findByIdWithDirectPriceAndMuebles(id);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    const internacionalizacion = await this.internacionalizacionRepository.findByHabitacionId(id);

    return toPublicHabitacionWithMueblesDto(result.habitacion, result.muebles, internacionalizacion, locale);
  }
}
