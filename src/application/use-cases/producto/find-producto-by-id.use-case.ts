import { inject, injectable } from "tsyringe";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../domain/exceptions/producto.exception";
import { ProductoDto, toProductoDto } from "../../dtos/producto.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindProductoByIdUseCase {
  constructor(@inject(DI_TOKENS.IProductoRepository) private readonly repository: IProductoRepository) {}

  async execute(id: string): Promise<ProductoDto> {
    const producto = await this.repository.findById(id);

    if (!producto) {
      throw ProductoException.notFoundById(id);
    }

    return toProductoDto(producto);
  }
}