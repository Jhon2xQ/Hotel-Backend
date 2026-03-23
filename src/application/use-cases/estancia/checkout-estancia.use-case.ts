import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { CheckoutEstanciaInput } from "../../dtos/estancia.dto";

export class CheckoutEstanciaUseCase {
  constructor(private estanciaRepository: IEstanciaRepository) {}

  async execute(id: string, input: CheckoutEstanciaInput): Promise<Estancia> {
    return await this.estanciaRepository.checkout(id, input.fechaSalida);
  }
}
