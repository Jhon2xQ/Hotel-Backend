import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(): Promise<Reserva[]> {
    return await this.reservaRepository.findAll();
  }
}
