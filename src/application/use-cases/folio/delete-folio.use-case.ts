import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteFolioUseCase {
  constructor(@inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository) {}

  async execute(id: string): Promise<void> {
    const existingFolio = await this.repository.findById(id);
    if (!existingFolio) {
      throw FolioException.notFoundById(id);
    }

    if (existingFolio.estado === false) {
      throw FolioException.cannotModifyClosed();
    }

    await this.repository.delete(id);
  }
}