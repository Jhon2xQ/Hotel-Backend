import { IHabitationRepository } from "../../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../domain/exceptions/habitation.exception";
import { CreateHabitationInput, HabitationOutput } from "../../dtos/habitation.dto";

export class CreateHabitationUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(input: CreateHabitationInput): Promise<HabitationOutput> {
    // Check for duplicate numero
    const existing = await this.repository.findByNumero(input.numero);
    if (existing) {
      throw HabitationException.duplicateNumero(input.numero);
    }

    // Create and persist
    const habitation = await this.repository.create(input);
    return habitation.toOutput();
  }
}
