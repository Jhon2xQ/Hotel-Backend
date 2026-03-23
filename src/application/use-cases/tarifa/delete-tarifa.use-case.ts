import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";

export class DeleteTarifaUseCase {
  constructor(private repository: ITarifaRepository) {}

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
