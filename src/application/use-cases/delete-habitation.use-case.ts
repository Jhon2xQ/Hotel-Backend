import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";

export class DeleteHabitationUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string): Promise<void> {
    this.validateUUID(id);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitationException.notFoundById(id);
    }

    await this.repository.delete(id);
  }

  private validateUUID(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw HabitationException.invalidUUID(id);
    }
  }
}
