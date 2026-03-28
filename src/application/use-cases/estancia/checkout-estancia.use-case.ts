import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { CheckoutEstanciaInput } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CheckoutEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string, input: CheckoutEstanciaInput): Promise<Estancia> {
    return await this.estanciaRepository.checkout(id, input.fechaSalida);
  }
}
