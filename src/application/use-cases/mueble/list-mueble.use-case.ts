import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleOutput } from "../../dtos/mueble.dto";

export class ListMueblesUseCase {
  constructor(private repository: IMuebleRepository) {}

  async execute(): Promise<MuebleOutput[]> {
    const furnitures = await this.repository.findAll();
    return furnitures.map((f) => f.toOutput());
  }
}
