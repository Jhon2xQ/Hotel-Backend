import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { HabitacionOutput } from "../../dtos/habitacion.dto";

export class FindHabitacionByIdUseCase {
  constructor(private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<HabitacionOutput> {
    const habitacion = await this.repository.findById(id);

    if (!habitacion) {
      throw HabitacionException.notFoundById();
    }

    return habitacion.toOutput();
  }
}
