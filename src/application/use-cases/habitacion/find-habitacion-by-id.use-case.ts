import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { toHabitacionWithMueblesDto, type HabitacionWithMueblesDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionByIdUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<HabitacionWithMueblesDto> {
    const result = await this.repository.findByIdWithMuebles(id);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    return toHabitacionWithMueblesDto(result.habitacion, result.muebles);
  }
}
