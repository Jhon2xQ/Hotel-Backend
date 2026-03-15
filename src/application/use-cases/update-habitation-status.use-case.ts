import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";
import { Habitation } from "../../domain/entities/habitation.entity";
import { UpdateHabitationStatusInput, HabitationOutput } from "../dtos/habitation.dto";

export class UpdateHabitationStatusUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string, input: UpdateHabitationStatusInput): Promise<HabitationOutput> {
    this.validateUUID(id);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitationException.notFoundById(id);
    }

    const updated = await this.repository.updateStatus(id, input.estado);
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
