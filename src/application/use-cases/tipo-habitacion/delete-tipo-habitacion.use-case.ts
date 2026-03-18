import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";

export class DeleteTipoHabitacionUseCase {
  constructor(private repository: ITipoHabitacionRepository) {}

  async execute(id: string): Promise<void> {
    // Validate TipoHabitacion exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TipoHabitacionException.notFoundById(id);
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
