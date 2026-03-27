import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";

export class DeleteHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}
