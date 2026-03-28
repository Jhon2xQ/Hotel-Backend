import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.reservaRepository.delete(id);
  }
}
