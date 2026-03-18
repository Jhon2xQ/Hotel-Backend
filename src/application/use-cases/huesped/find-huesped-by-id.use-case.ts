import { Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";

export class FindHuespedByIdUseCase {
  constructor(private readonly repository: IHuespedRepository) {}

  async execute(id: string): Promise<Huesped> {
    const huesped = await this.repository.findById(id);

    if (!huesped) {
      throw HuespedException.notFoundById(id);
    }

    return huesped;
  }
}
