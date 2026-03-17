import { IHabitationRepository } from "../../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../domain/exceptions/habitation.exception";

export class DeleteHabitationUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitationException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}
