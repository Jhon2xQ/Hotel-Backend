import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateFolioUseCase } from "../../application/use-cases/folio/create-folio.use-case";
import { ListFolioPaginatedUseCase } from "../../application/use-cases/folio/list-folio-paginated.use-case";
import { FindFolioByIdUseCase } from "../../application/use-cases/folio/find-folio-by-id.use-case";
import { UpdateFolioUseCase } from "../../application/use-cases/folio/update-folio.use-case";
import { DeleteFolioUseCase } from "../../application/use-cases/folio/delete-folio.use-case";
import { AddProductoFolioUseCase } from "../../application/use-cases/folio/add-producto-folio.use-case";
import { AddServicioFolioUseCase } from "../../application/use-cases/folio/add-servicio-folio.use-case";
import { GetConsumosFolioUseCase } from "../../application/use-cases/folio/get-consumos-folio.use-case";
import type { CreateFolioDto, UpdateFolioDto, CreateFolioProductoDto, CreateFolioServicioDto } from "../../application/dtos/folio.dto";
import type { ListFolioQuery } from "../../presentation/schemas/folio.schema";

@injectable()
export class FolioController {
  constructor(
    private readonly createUseCase: CreateFolioUseCase,
    private readonly listPaginatedUseCase: ListFolioPaginatedUseCase,
    private readonly findByIdUseCase: FindFolioByIdUseCase,
    private readonly updateUseCase: UpdateFolioUseCase,
    private readonly deleteUseCase: DeleteFolioUseCase,
    private readonly addProductoUseCase: AddProductoFolioUseCase,
    private readonly addServicioUseCase: AddServicioFolioUseCase,
    private readonly getConsumosUseCase: GetConsumosFolioUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateFolioDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Folio creado exitosamente", result), 201);
  }

  async listPaginated(c: AppContext) {
    const validData = c.get("validData") as ListFolioQuery;
    const result = await this.listPaginatedUseCase.execute(validData);
    return c.json(ApiResponse.success("Folios obtenidos exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Folio encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateFolioDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Folio actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Folio eliminado exitosamente"), 200);
  }

  async addProducto(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as CreateFolioProductoDto;
    const result = await this.addProductoUseCase.execute(id, input);
    return c.json(ApiResponse.success("Producto agregado al folio", result), 201);
  }

  async addServicio(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as CreateFolioServicioDto;
    const result = await this.addServicioUseCase.execute(id, input);
    return c.json(ApiResponse.success("Servicio agregado al folio", result), 201);
  }

  async getConsumos(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.getConsumosUseCase.execute(id);
    return c.json(ApiResponse.success("Consumos obtenidos", result), 200);
  }
}
