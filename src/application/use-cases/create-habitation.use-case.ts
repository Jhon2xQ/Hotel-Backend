import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";
import { Habitation } from "../../domain/entities/habitation.entity";
import { CreateHabitationInput, HabitationOutput } from "../dtos/habitation.dto";

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
    return this.toOutput(habitation);
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
