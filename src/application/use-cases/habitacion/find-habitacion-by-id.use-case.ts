import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { toHabitacionDto, type HabitacionDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionByIdUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<HabitacionDto> {
    const habitacion = await this.repository.findById(id);

    if (!habitacion) {
      throw HabitacionException.notFoundById();
    }

    return toHabitacionDto(habitacion);
  }
}
