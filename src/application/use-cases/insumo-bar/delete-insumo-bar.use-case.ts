import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../domain/exceptions/insumo-bar.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteInsumoBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw InsumoBarException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}