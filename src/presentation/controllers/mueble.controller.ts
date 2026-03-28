import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateMuebleUseCase } from "../../application/use-cases/mueble/create-mueble.use-case";
import { ListMueblesUseCase } from "../../application/use-cases/mueble/list-mueble.use-case";
import { FindMuebleByIdUseCase } from "../../application/use-cases/mueble/find-mueble-by-id.use-case";
import { UpdateMuebleUseCase } from "../../application/use-cases/mueble/update-mueble.use-case";
import { DeleteMuebleUseCase } from "../../application/use-cases/mueble/delete-mueble.use-case";
import { CreateMuebleDto, UpdateMuebleDto } from "../../application/dtos/mueble.dto";

@injectable()
export class MuebleController {
  constructor(
    private createUseCase: CreateMuebleUseCase,
    private listUseCase: ListMueblesUseCase,
    private findByIdUseCase: FindMuebleByIdUseCase,
    private updateUseCase: UpdateMuebleUseCase,
    private deleteUseCase: DeleteMuebleUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateMuebleDto;
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
    const input = c.get("validData") as UpdateMuebleDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Mueble actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Mueble eliminado exitosamente"), 200);
  }
}
