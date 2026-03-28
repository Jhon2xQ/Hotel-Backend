import { inject, injectable } from "tsyringe";
import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { UpdateReservaInput } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string, input: UpdateReservaInput): Promise<Reserva> {
    // Verificar que la reserva existe
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById();
    }

    // Verificar si está completada
    if (existing.estado === "COMPLETADA") {
      throw ReservaException.cannotModifyCompleted();
    }

    // Validaciones de negocio
    if (input.fechaEntrada && input.fechaSalida) {
      if (input.fechaSalida <= input.fechaEntrada) {
        throw ReservaException.invalidDateRange();
      }
    }
    if (input.adultos !== undefined && input.adultos < 1) {
      throw ReservaException.invalidAdultos();
    }
    if (input.ninos !== undefined && input.ninos < 0) {
      throw ReservaException.invalidNinos();
    }

    return await this.reservaRepository.update(id, input);
  }
}
