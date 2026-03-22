import { Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository, UpdateHuespedData } from "../../../domain/interfaces/huesped.repository.interface";

export class UpdateHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(id: string, data: UpdateHuespedData): Promise<Huesped> {
    return await this.repository.update(id, data);
  }
}
