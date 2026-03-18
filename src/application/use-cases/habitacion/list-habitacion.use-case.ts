import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionOutput } from "../../dtos/habitacion.dto";

export class ListHabitacionUseCase {
  constructor(private repository: IHabitacionRepository) {}

  async execute(): Promise<HabitacionOutput[]> {
    const habitaciones = await this.repository.findAll();
    return habitaciones.map((habitacion) => habitacion.toOutput());
  }
}
