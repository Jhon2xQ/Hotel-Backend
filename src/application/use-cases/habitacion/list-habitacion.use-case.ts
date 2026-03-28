import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionOutput } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListHabitacionUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(): Promise<HabitacionOutput[]> {
    const habitaciones = await this.repository.findAll();
    return habitaciones.map((habitacion) => habitacion.toOutput());
  }
}
