import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { CreateReservaInput } from "../../dtos/reserva.dto";

export class CreateReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(input: CreateReservaInput): Promise<Reserva> {
    return await this.reservaRepository.create({
      codigo: input.codigo,
      huespedId: input.huespedId,
      habitacionId: input.habitacionId,
      tarifaId: input.tarifaId,
      fechaEntrada: input.fechaEntrada,
      fechaSalida: input.fechaSalida,
      adultos: input.adultos,
      ninos: input.ninos,
      montoDescuento: input.montoDescuento,
    });
  }
}
