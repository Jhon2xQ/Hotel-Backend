import { IHabitationRepository } from "../../../domain/interfaces/habitation.repository.interface";
import { HabitationOutput } from "../../dtos/habitation.dto";

export class ListHabitationsUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(): Promise<HabitationOutput[]> {
    const habitations = await this.repository.findAll();
    return habitations.map((h) => h.toOutput());
  }
}
