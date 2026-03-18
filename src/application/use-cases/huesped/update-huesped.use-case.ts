import { Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository, UpdateHuespedData } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";

export class UpdateHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(id: string, data: UpdateHuespedData): Promise<Huesped> {
    if (data.nivelVip !== undefined && (data.nivelVip < 0 || data.nivelVip > 2)) {
      throw HuespedException.invalidNivelVip(data.nivelVip);
    }

    return await this.repository.update(id, data);
  }
}
