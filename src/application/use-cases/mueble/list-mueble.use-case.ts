import { inject, injectable } from "tsyringe";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleDto, toMuebleDto } from "../../dtos/mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListMueblesUseCase {
  constructor(@inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository) {}

  async execute(): Promise<MuebleDto[]> {
    const furnitures = await this.repository.findAll();
    return furnitures.map((f) => toMuebleDto(f));
  }
}
