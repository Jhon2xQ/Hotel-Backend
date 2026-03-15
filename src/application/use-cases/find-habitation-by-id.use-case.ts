import { IHabitationRepository } from "../../domain/interfaces/habitation.repository.interface";
import { HabitationException } from "../../domain/exceptions/habitation.exception";
import { Habitation } from "../../domain/entities/habitation.entity";
import { HabitationOutput } from "../dtos/habitation.dto";

export class FindHabitationByIdUseCase {
  constructor(private repository: IHabitationRepository) {}

  async execute(id: string): Promise<HabitationOutput> {
    this.validateUUID(id);

    const habitation = await this.repository.findById(id);
    if (!habitation) {
      throw HabitationException.notFoundById(id);
    }

    return this.toOutput(habitation);
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
