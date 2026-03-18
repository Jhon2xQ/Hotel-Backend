import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { UpdateTipoHabitacionInput, TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class UpdateTipoHabitacionUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(id: string, input: UpdateTipoHabitacionInput): Promise<TipoHabitacionOutput> {
    // Validate TipoHabitacion exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TipoHabitacionException.notFoundById();
    }

    // Call repository.update and return TipoHabitacionOutput
    const updated = await this.repository.update(id, {
      nombre: input.nombre,
      descripcion: input.descripcion,
    });

    return updated.toOutput();
  }
}
