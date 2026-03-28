import { inject, injectable } from "tsyringe";
import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleOutput } from "../../dtos/mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListMueblesUseCase {
  constructor(@inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository) {}

  async execute(): Promise<MuebleOutput[]> {
    const furnitures = await this.repository.findAll();
    return furnitures.map((f) => f.toOutput());
  }
}
