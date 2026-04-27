import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { IInternacionalizacionRepository } from "../../../domain/interfaces/internacionalizacion.repository.interface";
import type { Habitacion } from "../../../domain/entities/habitacion.entity";
import {
  PublicHabitacionWithPriceDto,
  SearchAvailableHabitacionesDto,
  toPublicHabitacionDto,
} from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class SearchAvailableHabitacionesUseCase {
  constructor(
    @inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository,
    @inject(DI_TOKENS.IInternacionalizacionRepository)
    private internacionalizacionRepository: IInternacionalizacionRepository,
  ) {}

  async execute(input: SearchAvailableHabitacionesDto): Promise<PublicHabitacionWithPriceDto[]> {
    const locale = input.locale ?? "es";
    let results: Array<{ habitacion: Habitacion; precioNoche: number | null }>;

    if (input.fecha_inicio && input.fecha_fin) {
      results = await this.repository.findAvailableInDateRange(input.fecha_inicio, input.fecha_fin, input.tipo);
    } else if (input.tipo) {
      results = await this.repository.findByTipoWithDirectPrice(input.tipo);
    } else {
      results = await this.repository.findAllWithDirectPrice();
    }

    let output = await Promise.all(
      results.map(async (r) => {
        const internacionalizacion = await this.internacionalizacionRepository.findByHabitacionId(r.habitacion.id);
        return {
          habitacion: toPublicHabitacionDto(r.habitacion, internacionalizacion, locale),
          precio_noche: r.precioNoche,
        };
      }),
    );

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
