import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionStatusInput, HabitacionOutput } from "../../dtos/habitacion.dto";

export class UpdateHabitacionStatusUseCase {
  constructor(private repository: IHabitacionRepository) {}

  async execute(id: string, input: UpdateHabitacionStatusInput): Promise<HabitacionOutput> {
    // Validate Habitacion exists (Requirement 10.1, 10.9)
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    // Call repository.updateStatus and return HabitacionOutput (Requirement 10.1, 10.5, 10.6)
    // If limpieza changes to LIMPIA, set ultimaLimpieza to current timestamp (Requirement 10.6)
    const updated = await this.repository.updateStatus(id, {
      estado: input.estado,
      ultiLimpieza: input.ulti_limpieza ? new Date(input.ulti_limpieza) : null,
    });

    return updated.toOutput();
  }
}
