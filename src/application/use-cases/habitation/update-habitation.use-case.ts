import { IHabitationRepository } from "../../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../domain/exceptions/habitation.exception";
import { UpdateHabitationInput, HabitationOutput } from "../../dtos/habitation.dto";

export class UpdateHabitationUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string, input: UpdateHabitationInput): Promise<HabitationOutput> {
    // Check existence
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitationException.notFoundById(id);
    }

    // Check numero conflict only if numero is being updated
    if (input.numero && input.numero !== existing.numero) {
      const duplicate = await this.repository.findByNumero(input.numero);
      if (duplicate) {
        throw HabitationException.duplicateNumero(input.numero);
      }
    }

    const updated = await this.repository.update(id, input);
    return updated.toOutput();
  }
}
