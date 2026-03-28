import { injectable } from "tsyringe";
import { CreateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/create-categoria-mueble.use-case";
import { DeleteCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/delete-categoria-mueble.use-case";
import { FindCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/find-categoria-mueble-by-id.use-case";
import { ListCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/list-categoria-mueble.use-case";
import { UpdateCategoriaMuebleUseCase } from "../../application/use-cases/categoria-mueble/update-categoria-mueble.use-case";
import {
  CreateCategoriaMuebleDto,
  UpdateCategoriaMuebleDto,
} from "../../application/dtos/categoria-mueble.dto";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";

@injectable()
export class CategoriaMuebleController {
  constructor(
    private readonly createUseCase: CreateCategoriaMuebleUseCase,
    private readonly listUseCase: ListCategoriaMuebleUseCase,
    private readonly findByIdUseCase: FindCategoriaMuebleUseCase,
    private readonly updateUseCase: UpdateCategoriaMuebleUseCase,
    private readonly deleteUseCase: DeleteCategoriaMuebleUseCase,
  ) {}

  async create(c: AppContext) {
    const validData = c.get("validData") as CreateCategoriaMuebleDto;
    const dto = await this.createUseCase.execute(validData);
    return c.json(ApiResponse.success("Categoría de mueble creada exitosamente", dto), 201);
  }

  async list(c: AppContext) {
    const output = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Categorías de mueble obtenidas exitosamente", output), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const dto = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Categoría de mueble encontrada", dto), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as UpdateCategoriaMuebleDto;
    const dto = await this.updateUseCase.execute(id, validData);
    return c.json(ApiResponse.success("Categoría de mueble actualizada exitosamente", dto), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Categoría de mueble eliminada exitosamente"), 200);
  }
}
