import { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";

export class DeleteHabitacionUseCase {
  constructor(private repository: IHabitacionRepository) {}

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
