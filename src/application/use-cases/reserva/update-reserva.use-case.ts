import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { EstadoReserva } from "../../../domain/entities/reserva.entity";
import { UpdateReservaDto } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";
import type { Reserva } from "../../../domain/entities/reserva.entity";

@injectable()
export class UpdateReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string, input: UpdateReservaDto): Promise<Reserva> {
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById();
    }

    if (existing.estado === EstadoReserva.COMPLETADA) {
      throw ReservaException.cannotModifyCompleted();
    }

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

    if (input.fechaEntrada || input.fechaSalida || input.habitacionId) {
      const fechaEntrada = input.fechaEntrada || existing.fechaEntrada;
      const fechaSalida = input.fechaSalida || existing.fechaSalida;
      const habitacionId = input.habitacionId || existing.habitacion.id;

      const conflicting = await this.reservaRepository.findConflictingReservations(
        habitacionId,
        fechaEntrada,
        fechaSalida,
        id,
      );
      if (conflicting.length > 0) {
        throw ReservaException.dateRangeConflict();
      }
    }

    const updated = await this.reservaRepository.update(id, input);
    if (!updated) {
      throw ReservaException.notFoundById();
    }

    return updated;
  }
}
