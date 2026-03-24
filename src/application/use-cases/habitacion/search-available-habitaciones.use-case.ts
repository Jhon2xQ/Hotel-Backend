import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionAvailableOutput, SearchAvailableHabitacionesInput } from "../../dtos/habitacion.dto";

export class SearchAvailableHabitacionesUseCase {
  constructor(private repository: IHabitacionRepository) {}

  async execute(input: SearchAvailableHabitacionesInput): Promise<HabitacionAvailableOutput[]> {
    const filters: any = {};

    if (input.tipo) {
      filters.tipoNombre = input.tipo;
    }

    if (input.fecha_inicio && input.fecha_fin) {
      filters.fechaInicio = new Date(input.fecha_inicio);
      filters.fechaFin = new Date(input.fecha_fin);
    }

    if (input.orden_precio) {
      filters.ordenPrecio = input.orden_precio;
    }

    const habitaciones = await this.repository.findAvailableWithFilters(filters);

    return habitaciones.map((habitacion) => {
      const output = habitacion.toOutput();
      return {
        ...output,
        precio_noche: habitacion.precioNoche,
      };
    });
  }
}
