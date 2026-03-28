import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { HabitacionWithPriceDto, toHabitacionDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionByIdWithPriceUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<HabitacionWithPriceDto> {
    const result = await this.repository.findByIdWithDirectPrice(id);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    return {
      habitacion: toHabitacionDto(result.habitacion),
      precio_noche: result.precioNoche,
    };
  }
}
