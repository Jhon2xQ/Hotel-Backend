import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.estanciaRepository.delete(id);
  }
}
