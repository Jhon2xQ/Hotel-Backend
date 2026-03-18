import { CreateHuespedData, Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";

export class CreateHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(data: CreateHuespedData): Promise<Huesped> {
    if (data.nivelVip !== undefined && (data.nivelVip < 0 || data.nivelVip > 2)) {
      throw HuespedException.invalidNivelVip(data.nivelVip);
    }

    return await this.repository.create(data);
  }
}
