import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateFurnitureCatalogUseCase } from "../../application/use-cases/furniture-catalog/create-furniture-catalog.use-case";
import { ListFurnitureCatalogsUseCase } from "../../application/use-cases/furniture-catalog/list-furniture-catalogs.use-case";
import { FindFurnitureCatalogByIdUseCase } from "../../application/use-cases/furniture-catalog/find-furniture-catalog-by-id.use-case";
import { UpdateFurnitureCatalogUseCase } from "../../application/use-cases/furniture-catalog/update-furniture-catalog.use-case";
import { DeleteFurnitureCatalogUseCase } from "../../application/use-cases/furniture-catalog/delete-furniture-catalog.use-case";
import { CreateFurnitureCatalogInput, UpdateFurnitureCatalogInput } from "../../application/dtos/furniture-catalog.dto";

export class FurnitureCatalogController {
  constructor(
    private createUseCase: CreateFurnitureCatalogUseCase,
    private listUseCase: ListFurnitureCatalogsUseCase,
    private findByIdUseCase: FindFurnitureCatalogByIdUseCase,
    private updateUseCase: UpdateFurnitureCatalogUseCase,
    private deleteUseCase: DeleteFurnitureCatalogUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateFurnitureCatalogInput;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Mueble creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Muebles obtenidos exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Mueble encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateFurnitureCatalogInput;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Mueble actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Mueble eliminado exitosamente"), 200);
  }
}
