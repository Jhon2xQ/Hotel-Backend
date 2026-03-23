import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { MuebleOutput } from "../../dtos/mueble.dto";

export class FindMuebleByIdUseCase {
  constructor(private repository: IMuebleRepository) {}

  async execute(id: string): Promise<MuebleOutput> {
    const furniture = await this.repository.findById(id);
    if (!furniture) {
      throw MuebleException.notFoundById();
    }
    return furniture.toOutput();
  }
}
