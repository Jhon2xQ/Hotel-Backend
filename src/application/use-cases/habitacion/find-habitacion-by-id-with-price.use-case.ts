import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { toPublicHabitacionWithMueblesDto, type PublicHabitacionWithMueblesDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionByIdWithPriceUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<PublicHabitacionWithMueblesDto> {
    const result = await this.repository.findByIdWithDirectPriceAndMuebles(id);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    return toPublicHabitacionWithMueblesDto(result.habitacion, result.muebles);
  }
}
