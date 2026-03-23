import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";

export class FindReservaByIdUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw ReservaException.notFoundById(id);
    }
    return reserva;
  }
}
