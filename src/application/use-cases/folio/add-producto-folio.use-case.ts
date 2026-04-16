import { inject, injectable } from "tsyringe";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import { CreateFolioProductoDto, FolioProductoDto, toFolioProductoDto } from "../../dtos/folio.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class AddProductoFolioUseCase {
  constructor(
    @inject(DI_TOKENS.IFolioRepository) private repository: IFolioRepository,
    @inject(DI_TOKENS.IProductoRepository) private productoRepository: IProductoRepository,
  ) {}

  async execute(folioId: string, input: CreateFolioProductoDto): Promise<FolioProductoDto> {
    const folio = await this.repository.findById(folioId);
    if (!folio) {
      throw FolioException.notFoundById(folioId);
    }

    if (!folio.estado) {
      throw FolioException.cannotModifyClosed();
    }

    const producto = await this.productoRepository.findById(input.productoId);
    if (!producto) {
      throw FolioException.productoNotFound();
    }

    const precioUnit = Number(producto.precioUnitario);

    const folioProducto = await this.repository.addProducto({
      folioId,
      productoId: input.productoId,
      cantidad: input.cantidad,
      precioUnit,
    });

    return toFolioProductoDto(folioProducto);
  }
}
