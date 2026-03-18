import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class ListTipoHabitacionUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(): Promise<TipoHabitacionOutput[]> {
    const tiposHabitacion = await this.repository.findAll();
    return tiposHabitacion.map((tipo) => tipo.toOutput());
  }
}
