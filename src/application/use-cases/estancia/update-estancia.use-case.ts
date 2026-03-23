import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { UpdateEstanciaInput } from "../../dtos/estancia.dto";

export class UpdateEstanciaUseCase {
  constructor(private estanciaRepository: IEstanciaRepository) {}

  async execute(id: string, input: UpdateEstanciaInput): Promise<Estancia> {
    return await this.estanciaRepository.update(id, input);
  }
}
