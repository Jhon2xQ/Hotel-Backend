import { inject, injectable } from "tsyringe";
import { Huesped } from "../../../domain/entities/huesped.entity";
import { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { HuespedException } from "../../../domain/exceptions/huesped.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHuespedByIdUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(id: string): Promise<Huesped> {
    const huesped = await this.repository.findById(id);

    if (!huesped) {
      throw HuespedException.notFoundById(id);
    }

    return huesped;
  }
}
