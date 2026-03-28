import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteHabitacionUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string): Promise<void> {
    // Validate Habitacion exists (Requirement 11.5)
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    // Check for related Estancia records (Requirement 11.3)
    const hasRelated = await this.repository.hasRelatedRecords(id);
    if (hasRelated) {
      throw HabitacionException.hasRelatedRecords();
    }

    // Call repository.delete (Requirement 11.1)
    await this.repository.delete(id);
  }
}
