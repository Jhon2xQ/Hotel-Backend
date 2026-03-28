import { inject, injectable } from "tsyringe";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}
