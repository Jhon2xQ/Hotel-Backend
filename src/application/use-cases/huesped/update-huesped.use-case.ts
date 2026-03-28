import { inject, injectable } from "tsyringe";
import { Huesped } from "../../../domain/entities/huesped.entity";
import type { IHuespedRepository, UpdateHuespedData } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(id: string, data: UpdateHuespedData): Promise<Huesped> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw HuespedException.notFoundById(id);
    }

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.repository.findByEmail(data.email);

      if (emailExists) {
        throw HuespedException.duplicateEmail(data.email);
      }
    }

    return await this.repository.update(id, data);
  }
}
