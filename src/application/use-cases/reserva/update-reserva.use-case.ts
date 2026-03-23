import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { UpdateReservaInput } from "../../dtos/reserva.dto";

export class UpdateReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(id: string, input: UpdateReservaInput): Promise<Reserva> {
    return await this.reservaRepository.update(id, input);
  }
}
