import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { CreateReservaInput } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";

export class CreateReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(input: CreateReservaInput): Promise<Reserva> {
    // Validaciones de negocio
    if (input.fechaSalida <= input.fechaEntrada) {
      throw ReservaException.invalidDateRange();
    }
    if (input.adultos < 1) {
      throw ReservaException.invalidAdultos();
    }
    if (input.ninos < 0) {
      throw ReservaException.invalidNinos();
    }

    // Verificar código único
    const existingCodigo = await this.reservaRepository.findByCodigo(input.codigo);
    if (existingCodigo) {
      throw ReservaException.duplicateCodigo(input.codigo);
    }

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
