import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { EstadoReserva } from "../../../domain/entities/reserva.entity";
import { UpdateEstadoReservaDto } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";
import type { Reserva } from "../../../domain/entities/reserva.entity";

@injectable()
export class UpdateEstadoReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string, input: UpdateEstadoReservaDto): Promise<Reserva> {
    const existing = await this.reservaRepository.findById(id);
    if (!existing) {
      throw ReservaException.notFoundById(id);
    }

    if (input.estado === EstadoReserva.CANCELADA) {
      throw ReservaException.useCancelEndpoint();
    }

    const updated = await this.reservaRepository.update(id, {
      estado: input.estado,
    });
    if (!updated) {
      throw ReservaException.notFoundById(id);
    }

    return updated;
  }
}
