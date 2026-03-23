import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";

export class DeleteReservaUseCase {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(id: string): Promise<void> {
    await this.reservaRepository.delete(id);
  }
}
