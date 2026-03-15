import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";
import { Habitation } from "../../domain/entities/habitation.entity";
import { UpdateHabitationInput, HabitationOutput } from "../dtos/habitation.dto";

export class UpdateHabitationUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string, input: UpdateHabitationInput): Promise<HabitationOutput> {
    this.validateUUID(id);

    // Check existence
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitationException.notFoundById(id);
    }

    // Check numero conflict
    if (input.numero !== existing.numero) {
      const duplicate = await this.repository.findByNumero(input.numero);
      if (duplicate) {
        throw HabitationException.duplicateNumero(input.numero);
      }
    }

    const updated = await this.repository.update(id, input);
    return this.toOutput(updated);
  }

  private validateUUID(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw HabitationException.invalidUUID(id);
    }
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
