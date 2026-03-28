import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { Habitacion } from "../../../domain/entities/habitacion.entity";
import {
  HabitacionWithPriceDto,
  SearchAvailableHabitacionesDto,
  toHabitacionDto,
} from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class SearchAvailableHabitacionesUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(input: SearchAvailableHabitacionesDto): Promise<HabitacionWithPriceDto[]> {
    let results: Array<{ habitacion: Habitacion; precioNoche: number | null }>;

    if (input.fecha_inicio && input.fecha_fin) {
      results = await this.repository.findAvailableInDateRange(input.fecha_inicio, input.fecha_fin, input.tipo);
    } else if (input.tipo) {
      results = await this.repository.findByTipoWithDirectPrice(input.tipo);
    } else {
      results = await this.repository.findAllWithDirectPrice();
    }

    let output = results.map((r) => ({
      habitacion: toHabitacionDto(r.habitacion),
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
