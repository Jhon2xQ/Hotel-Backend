import { inject, injectable } from "tsyringe";
import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { EstanciaException } from "../../../domain/exceptions/estancia.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindEstanciaByIdUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string): Promise<Estancia> {
    const estancia = await this.estanciaRepository.findById(id);
    if (!estancia) {
      throw EstanciaException.notFoundById(id);
    }
    return estancia;
  }
}
