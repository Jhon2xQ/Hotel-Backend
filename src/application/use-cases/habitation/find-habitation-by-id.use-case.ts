import { IHabitationRepository } from "../../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../../domain/exceptions/habitation.exception";
import { HabitationOutput } from "../../dtos/habitation.dto";

export class FindHabitationByIdUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string): Promise<HabitationOutput> {
    const habitation = await this.repository.findById(id);
    if (!habitation) {
      throw HabitationException.notFoundById(id);
    }

    return habitation.toOutput();
  }
}
