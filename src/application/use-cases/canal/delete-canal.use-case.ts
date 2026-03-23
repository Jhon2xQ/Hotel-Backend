import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../domain/exceptions/canal.exception";

export class DeleteCanalUseCase {
  constructor(private repository: ICanalRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw CanalException.notFoundById();
    }

    const hasRelated = await this.repository.hasRelatedRecords(id);
    if (hasRelated) {
      throw CanalException.hasRelatedRecords();
    }

    await this.repository.delete(id);
  }
}
