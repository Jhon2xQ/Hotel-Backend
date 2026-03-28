import { inject, injectable } from "tsyringe";
import { IMuebleRepository } from "../../../domain/interfaces/mueble.repository.interface";
import { MuebleException } from "../../../domain/exceptions/mueble.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteMuebleUseCase {
  constructor(@inject(DI_TOKENS.IMuebleRepository) private repository: IMuebleRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw MuebleException.notFoundById();
    }

    await this.repository.delete(id);
  }
}
