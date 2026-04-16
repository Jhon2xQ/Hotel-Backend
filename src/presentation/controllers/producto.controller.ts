import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateProductoUseCase } from "../../application/use-cases/producto/create-producto.use-case";
import { ListProductoPaginatedUseCase } from "../../application/use-cases/producto/list-producto-paginated.use-case";
import { FindProductoByIdUseCase } from "../../application/use-cases/producto/find-producto-by-id.use-case";
import { UpdateProductoUseCase } from "../../application/use-cases/producto/update-producto.use-case";
import { DeleteProductoUseCase } from "../../application/use-cases/producto/delete-producto.use-case";
import { CreateProductoDto, UpdateProductoDto } from "../../application/dtos/producto.dto";

@injectable()
export class ProductoController {
  constructor(
    private createUseCase: CreateProductoUseCase,
    private listPaginatedUseCase: ListProductoPaginatedUseCase,
    private findByIdUseCase: FindProductoByIdUseCase,
    private updateUseCase: UpdateProductoUseCase,
    private deleteUseCase: DeleteProductoUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateProductoDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Producto creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const { page, limit } = c.req.query();
    const result = await this.listPaginatedUseCase.execute({
      page: Number.parseInt(page ?? "1", 10),
      limit: Number.parseInt(limit ?? "10", 10),
    });
    return c.json(ApiResponse.success("Productos obtenidos exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Producto encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateProductoDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Producto actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Producto eliminado exitosamente"), 200);
  }
}