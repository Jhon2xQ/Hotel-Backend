import { inject, injectable } from "tsyringe";
import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteTarifaUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TarifaException.notFoundById();
    }

    const hasRelated = await this.repository.hasRelatedRecords(id);
    if (hasRelated) {
      throw TarifaException.hasRelatedRecords();
    }

    await this.repository.delete(id);
  }
}
