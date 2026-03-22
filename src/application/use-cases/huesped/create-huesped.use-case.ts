import { CreateHuespedData, Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";

export class CreateHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(data: CreateHuespedData): Promise<Huesped> {
    return await this.repository.create(data);
  }
}
