import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";

export class ListReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(): Promise<Reserva[]> {
    return await this.reservaRepository.findAll();
  }
}
