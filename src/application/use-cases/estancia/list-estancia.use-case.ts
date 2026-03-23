import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";

export class ListEstanciaUseCase {
  constructor(private estanciaRepository: IEstanciaRepository) {}

  async execute(): Promise<Estancia[]> {
    return await this.estanciaRepository.findAll();
  }
}
