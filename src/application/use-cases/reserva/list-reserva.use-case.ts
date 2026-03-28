import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { ReservaDto, toReservaDto } from "../../dtos/reserva.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(): Promise<ReservaDto[]> {
    const reservas = await this.reservaRepository.findAll();
    return reservas.map((r) => toReservaDto(r));
  }
}
