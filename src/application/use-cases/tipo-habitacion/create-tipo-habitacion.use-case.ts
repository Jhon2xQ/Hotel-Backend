import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { CreateTipoHabitacionInput, TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";

export class CreateTipoHabitacionUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(input: CreateTipoHabitacionInput): Promise<TipoHabitacionOutput> {

    const existingTH = await this.repository.findByName(input.nombre);  
    if (existingTH) {
      throw TipoHabitacionException.duplicateNombre(input.nombre);
    }

    const tipoHabitacion = await this.repository.create({
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
    });

    return tipoHabitacion.toOutput();
  }
}
