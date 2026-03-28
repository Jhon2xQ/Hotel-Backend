import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionStatusInput, HabitacionOutput } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHabitacionStatusUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

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
