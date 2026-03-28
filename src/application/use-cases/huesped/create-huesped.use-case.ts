import { inject, injectable } from "tsyringe";
import { CreateHuespedData, Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(data: CreateHuespedData): Promise<Huesped> {
    const existing = await this.repository.findByEmail(data.email);

    if (existing) {
      throw HuespedException.duplicateEmail(data.email);
    }

    return await this.repository.create(data);
  }
}
