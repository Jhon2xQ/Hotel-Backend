import { inject, injectable } from "tsyringe";
import type { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { MuebleOutput } from "../../dtos/mueble.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindMuebleByIdUseCase {
  constructor(@inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository) {}

  async execute(id: string): Promise<MuebleOutput> {
    const furniture = await this.repository.findById(id);
    if (!furniture) {
      throw MuebleException.notFoundById();
    }
    return furniture.toOutput();
  }
}
