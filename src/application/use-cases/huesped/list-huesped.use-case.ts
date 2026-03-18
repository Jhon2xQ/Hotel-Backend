import { Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";

export class ListHuespedUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(): Promise<Huesped[]> {
    return await this.repository.findAll();
  }
}
