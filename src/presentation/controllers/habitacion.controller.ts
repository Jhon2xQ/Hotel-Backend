import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateHabitacionUseCase } from "../../application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../../application/use-cases/habitacion/list-habitacion.use-case";
import { FindHabitacionByIdUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { UpdateHabitacionUseCase } from "../../application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../../application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../../application/use-cases/habitacion/delete-habitacion.use-case";
import {
  CreateHabitacionInput,
  UpdateHabitacionInput,
  UpdateHabitacionStatusInput,
} from "../../application/dtos/habitacion.dto";

export class HabitacionController {
  constructor(
    private createUseCase: CreateHabitacionUseCase,
    private listUseCase: ListHabitacionUseCase,
    private findByIdUseCase: FindHabitacionByIdUseCase,
    private updateUseCase: UpdateHabitacionUseCase,
    private updateStatusUseCase: UpdateHabitacionStatusUseCase,
    private deleteUseCase: DeleteHabitacionUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateHabitacionInput;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Habitación creada exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Habitaciones obtenidas exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Habitación encontrada", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateHabitacionInput;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Habitación actualizada exitosamente", result), 200);
  }

  async updateStatus(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateHabitacionStatusInput;
    const result = await this.updateStatusUseCase.execute(id, input);
    return c.json(ApiResponse.success("Estado de habitación actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Habitación eliminada exitosamente"), 200);
  }
}
