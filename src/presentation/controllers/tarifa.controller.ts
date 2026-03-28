import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateTarifaUseCase } from "../../application/use-cases/tarifa/create-tarifa.use-case";
import { ListTarifaUseCase } from "../../application/use-cases/tarifa/list-tarifa.use-case";
import { FindTarifaByIdUseCase } from "../../application/use-cases/tarifa/find-tarifa-by-id.use-case";
import { UpdateTarifaUseCase } from "../../application/use-cases/tarifa/update-tarifa.use-case";
import { DeleteTarifaUseCase } from "../../application/use-cases/tarifa/delete-tarifa.use-case";
import { CreateTarifaDto, UpdateTarifaDto } from "../../application/dtos/tarifa.dto";

@injectable()
export class TarifaController {
  constructor(
    private createUseCase: CreateTarifaUseCase,
    private listUseCase: ListTarifaUseCase,
    private findByIdUseCase: FindTarifaByIdUseCase,
    private updateUseCase: UpdateTarifaUseCase,
    private deleteUseCase: DeleteTarifaUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateTarifaDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Tarifa creada exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Tarifas obtenidas exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Tarifa encontrada", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateTarifaDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Tarifa actualizada exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Tarifa eliminada exitosamente"), 200);
  }
}
