import { inject, injectable } from "tsyringe";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import { ProductoException } from "../../../domain/exceptions/producto.exception";
import { CreateProductoDto, ProductoDto, toProductoDto } from "../../dtos/producto.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateProductoUseCase {
  constructor(@inject(DI_TOKENS.IProductoRepository) private readonly repository: IProductoRepository) {}

  async execute(data: CreateProductoDto): Promise<ProductoDto> {
    const existing = await this.repository.findByCodigo(data.codigo);

    if (existing) {
      throw ProductoException.conflictByCodigo(data.codigo);
    }

    const producto = await this.repository.create({
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precioUnitario: data.precio_unitario,
      stock: data.stock ?? 0,
    });

    return toProductoDto(producto);
  }
}