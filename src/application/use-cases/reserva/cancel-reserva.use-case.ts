import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { CancelReservaInput } from "../../dtos/reserva.dto";

export class CancelReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(id: string, input: CancelReservaInput): Promise<Reserva> {
    return await this.reservaRepository.cancel(id, input.motivoCancel);
  }
}
