import { inject, injectable } from "tsyringe";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../domain/exceptions/producto.exception";
import { UpdateProductoDto, ProductoDto, toProductoDto } from "../../dtos/producto.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateProductoUseCase {
  constructor(@inject(DI_TOKENS.IProductoRepository) private readonly repository: IProductoRepository) {}

  async execute(id: string, data: UpdateProductoDto): Promise<ProductoDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw ProductoException.notFoundById(id);
    }

    if (data.codigo && data.codigo !== existing.codigo) {
      const codigoExists = await this.repository.findByCodigo(data.codigo);
      if (codigoExists) {
        throw ProductoException.conflictByCodigo(data.codigo);
      }
    }

    const producto = await this.repository.update(id, {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precioUnitario: data.precio_unitario,
      stock: data.stock,
    });

    return toProductoDto(producto);
  }
}