import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { HabitacionWithPriceOutput } from "../../dtos/habitacion.dto";

export class FindHabitacionByIdWithPriceUseCase {
  constructor(private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<HabitacionWithPriceOutput> {
    const result = await this.repository.findByIdWithDirectPrice(id);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    return {
      habitacion: result.habitacion.toOutput(),
      precio_noche: result.precioNoche,
    };
  }
}
