import { inject, injectable } from "tsyringe";
import type { IProductoRepository } from "../../../domain/interfaces/producto.repository.interface";
import type { PaginatedResult, PaginationParams } from "../../paginations/api.pagination";
import { ProductoDto, toProductoDto } from "../../dtos/producto.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListProductoPaginatedUseCase {
  constructor(@inject(DI_TOKENS.IProductoRepository) private readonly repository: IProductoRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<ProductoDto>> {
    const result = await this.repository.findAllPaginated(params);
    return {
      list: result.list.map((p) => toProductoDto(p)),
      pagination: result.pagination,
    };
  }
}