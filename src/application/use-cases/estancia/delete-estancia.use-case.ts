import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";

export class DeleteEstanciaUseCase {
  constructor(private estanciaRepository: IEstanciaRepository) {}

  async execute(id: string): Promise<void> {
    await this.estanciaRepository.delete(id);
  }
}
