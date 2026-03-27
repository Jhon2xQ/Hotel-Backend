import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { UpdateEstadoReservaInput } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";

export class UpdateEstadoReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(id: string, input: UpdateEstadoReservaInput): Promise<Reserva> {
    // Verificar que la reserva existe
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById(id);
    }

    // Un admin puede cambiar de cualquier estado a cualquier estado
    // No hay restricciones para administradores

    // Validación: no se puede cambiar a CANCELADA usando este endpoint
    if (input.estado === "CANCELADA") {
      throw ReservaException.useCancelEndpoint();
    }

    // Actualizar solo el estado
    return await this.reservaRepository.update(id, {
      estado: input.estado,
    });
  }
}
