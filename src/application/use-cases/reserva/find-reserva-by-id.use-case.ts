import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { ReservaDto, toReservaDto } from "../../dtos/reserva.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindReservaByIdUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string): Promise<ReservaDto> {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw ReservaException.notFoundById(id);
    }
    return toReservaDto(reserva);
  }
}
