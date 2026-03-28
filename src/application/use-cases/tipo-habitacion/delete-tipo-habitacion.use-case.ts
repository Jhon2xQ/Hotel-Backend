import { inject, injectable } from "tsyringe";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteTipoHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Validate TipoHabitacion exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TipoHabitacionException.notFoundById();
    }

    // Check for related records (Habitacion, Tarifa, Reserva)
    const hasRelated = await this.repository.hasRelatedRecords(id);
    if (hasRelated) {
      throw TipoHabitacionException.hasRelatedRecords();
    }

    // Call repository.delete
    await this.repository.delete(id);
  }
}
