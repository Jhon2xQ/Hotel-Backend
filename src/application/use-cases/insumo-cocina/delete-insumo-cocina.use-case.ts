import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../domain/exceptions/insumo-cocina.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteInsumoCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw InsumoCocinaException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}