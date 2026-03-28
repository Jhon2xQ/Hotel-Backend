import { inject, injectable } from "tsyringe";
import { CategoriaMuebleException } from "../../../domain/exceptions/categoria-mueble.exception";
import type { ICategoriaMuebleRepository } from "../../../domain/interfaces/categoria-mueble.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteCategoriaMuebleUseCase {
  constructor(
    @inject(DI_TOKENS.ICategoriaMuebleRepository)
    private readonly categoriaMuebleRepository: ICategoriaMuebleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.categoriaMuebleRepository.findById(id);
    if (!existing) {
      throw CategoriaMuebleException.notFoundById(id);
    }
    await this.categoriaMuebleRepository.delete(id);
  }
}
