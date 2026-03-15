import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { Habitation } from "../../domain/entities/habitation.entity";
import { HabitationOutput } from "../dtos/habitation.dto";

export class ListHabitationsUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(): Promise<HabitationOutput[]> {
    const habitations = await this.repository.findAll();
    return habitations.map(this.toOutput);
  }

  private toOutput(habitation: Habitation): HabitationOutput {
    return {
      id: habitation.id,
      numero: habitation.numero,
      piso: habitation.piso,
      tipo: habitation.tipo,
      precio: habitation.precio,
      estado: habitation.estado,
      created_at: habitation.createdAt.toISOString(),
      updated_at: habitation.updatedAt.toISOString(),
    };
  }
}
