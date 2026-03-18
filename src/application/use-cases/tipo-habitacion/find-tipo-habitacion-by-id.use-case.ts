import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class FindTipoHabitacionByIdUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(id: string): Promise<TipoHabitacionOutput> {
    const tipoHabitacion = await this.repository.findById(id);

    if (!tipoHabitacion) {
      throw TipoHabitacionException.notFoundById(id);
    }

    return tipoHabitacion.toOutput();
  }
}
