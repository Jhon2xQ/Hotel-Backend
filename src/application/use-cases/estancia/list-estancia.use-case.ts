import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(): Promise<Estancia[]> {
    return await this.estanciaRepository.findAll();
  }
}
