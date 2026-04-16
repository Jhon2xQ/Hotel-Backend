import { inject, injectable } from "tsyringe";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../domain/exceptions/producto.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeleteProductoUseCase {
  constructor(@inject(DI_TOKENS.IProductoRepository) private readonly repository: IProductoRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw ProductoException.notFoundById(id);
    }

    await this.repository.delete(id);
  }
}