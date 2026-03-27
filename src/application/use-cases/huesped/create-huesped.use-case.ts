import { CreateHuespedData, Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";

export class CreateHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(data: CreateHuespedData): Promise<Huesped> {
    const existing = await this.repository.findByEmail(data.email);

    if (existing) {
      throw HuespedException.duplicateEmail(data.email);
    }

    return await this.repository.create(data);
  }
}
