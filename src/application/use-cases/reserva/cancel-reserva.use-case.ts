import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { EstadoReserva } from "../../../domain/entities/reserva.entity";
import { CancelReservaDto } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";
import type { Reserva } from "../../../domain/entities/reserva.entity";

@injectable()
export class CancelReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string, input: CancelReservaDto): Promise<Reserva> {
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById();
    }

    if (existing.estado === EstadoReserva.COMPLETADA) {
      throw ReservaException.cannotCancelCompleted();
    }

    if (existing.estado === EstadoReserva.CANCELADA) {
      throw ReservaException.alreadyCancelled();
    }

    if (!input.motivoCancel || input.motivoCancel.trim() === "") {
      throw ReservaException.cancelRequiresMotivo();
    }

    return await this.reservaRepository.cancel(id, input.motivoCancel);
  }
}
