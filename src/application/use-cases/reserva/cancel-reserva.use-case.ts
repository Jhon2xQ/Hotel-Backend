import { inject, injectable } from "tsyringe";
import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { CancelReservaInput } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CancelReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string, input: CancelReservaInput): Promise<Reserva> {
    // Verificar que la reserva existe
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById();
    }

    // Validaciones de negocio
    if (existing.estado === "COMPLETADA") {
      throw ReservaException.cannotCancelCompleted();
    }

    if (existing.estado === "CANCELADA") {
      throw ReservaException.alreadyCancelled();
    }

    if (!input.motivoCancel || input.motivoCancel.trim() === "") {
      throw ReservaException.cancelRequiresMotivo();
    }

    return await this.reservaRepository.cancel(id, input.motivoCancel);
  }
}
