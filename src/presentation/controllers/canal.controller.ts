import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateCanalUseCase } from "../../application/use-cases/canal/create-canal.use-case";
import { ListCanalUseCase } from "../../application/use-cases/canal/list-canal.use-case";
import { FindCanalByIdUseCase } from "../../application/use-cases/canal/find-canal-by-id.use-case";
import { UpdateCanalUseCase } from "../../application/use-cases/canal/update-canal.use-case";
import { DeleteCanalUseCase } from "../../application/use-cases/canal/delete-canal.use-case";
import { CreateCanalDto, UpdateCanalDto } from "../../application/dtos/canal.dto";

@injectable()
export class CanalController {
  constructor(
    private createUseCase: CreateCanalUseCase,
    private listUseCase: ListCanalUseCase,
    private findByIdUseCase: FindCanalByIdUseCase,
    private updateUseCase: UpdateCanalUseCase,
    private deleteUseCase: DeleteCanalUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateCanalDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Canal creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Canales obtenidos exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Canal encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateCanalDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Canal actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Canal eliminado exitosamente"), 200);
  }
}
