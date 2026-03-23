import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";

export class DeleteMuebleUseCase {
  constructor(private repository: IMuebleRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw MuebleException.notFoundById();
    }

    await this.repository.delete(id);
  }
}
