import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ListTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { FindTipoHabitacionByIdUseCase } from "../../application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { UpdateTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { DeleteTipoHabitacionUseCase } from "../../application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";
import { CreateTipoHabitacionInput, UpdateTipoHabitacionInput } from "../../application/dtos/tipo-habitacion.dto";

@injectable()
export class TipoHabitacionController {
  constructor(
    private createUseCase: CreateTipoHabitacionUseCase,
    private listUseCase: ListTipoHabitacionUseCase,
    private findByIdUseCase: FindTipoHabitacionByIdUseCase,
    private updateUseCase: UpdateTipoHabitacionUseCase,
    private deleteUseCase: DeleteTipoHabitacionUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateTipoHabitacionInput;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Tipo de habitación creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Tipos de habitación obtenidos exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Tipo de habitación encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateTipoHabitacionInput;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Tipo de habitación actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Tipo de habitación eliminado exitosamente"), 200);
  }
}
