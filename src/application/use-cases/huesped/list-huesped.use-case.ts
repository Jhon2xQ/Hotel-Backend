import { inject, injectable } from "tsyringe";
import { Huesped } from "../../../domain/entities/huesped.entity";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListHuespedUseCase {
  constructor(@inject(DI_TOKENS.IHuespedRepository) private readonly repository: IHuespedRepository) {}

  async execute(): Promise<Huesped[]> {
    return await this.repository.findAll();
  }
}
