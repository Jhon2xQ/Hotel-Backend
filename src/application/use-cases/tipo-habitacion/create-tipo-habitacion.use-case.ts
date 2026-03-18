import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { CreateTipoHabitacionInput, TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class CreateTipoHabitacionUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(input: CreateTipoHabitacionInput): Promise<TipoHabitacionOutput> {
    const tipoHabitacion = await this.repository.create({
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
    });

    return tipoHabitacion.toOutput();
  }
}
