import { inject, injectable } from "tsyringe";
import { PromocionException } from "../../../domain/exceptions/promocion.exception";
import type { IPromocionRepository } from "../../../domain/interfaces/promocion.repository.interface";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeletePromocionUseCase {
  constructor(@inject(DI_TOKENS.IPromocionRepository) private repository: IPromocionRepository) {}

  async execute(id: string): Promise<void> {
    const existingPromocion = await this.repository.findById(id);
    if (!existingPromocion) {
      throw PromocionException.notFoundById();
    }

    await this.repository.delete(id);
  }
}
