import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionWithPriceOutput, SearchAvailableHabitacionesInput } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class SearchAvailableHabitacionesUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(input: SearchAvailableHabitacionesInput): Promise<HabitacionWithPriceOutput[]> {
    let results: Array<{ habitacion: any; precioNoche: number | null }>;

    // Caso 1: Filtro por rango de fechas (con o sin tipo)
    if (input.fecha_inicio && input.fecha_fin) {
      const fechaInicio = new Date(input.fecha_inicio);
      const fechaFin = new Date(input.fecha_fin);
      results = await this.repository.findAvailableInDateRange(fechaInicio, fechaFin, input.tipo);
    }
    // Caso 2: Filtro solo por tipo
    else if (input.tipo) {
      results = await this.repository.findByTipoWithDirectPrice(input.tipo);
    }
    // Caso 3: Sin filtros, todas las habitaciones
    else {
      results = await this.repository.findAllWithDirectPrice();
    }

    // Mapear a DTO
    let output = results.map((r) => ({
      habitacion: r.habitacion.toOutput(),
      precio_noche: r.precioNoche,
    }));

    // Ordenar por precio si se especificó
    if (input.orden_precio) {
      output.sort((a, b) => {
        const precioA = a.precio_noche ?? Number.MAX_VALUE;
        const precioB = b.precio_noche ?? Number.MAX_VALUE;
        return input.orden_precio === "asc" ? precioA - precioB : precioB - precioA;
      });
    }

    return output;
  }
}
