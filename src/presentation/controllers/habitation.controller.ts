import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateHabitationUseCase } from "../../application/use-cases/habitation/create-habitation.use-case";
import { ListHabitationsUseCase } from "../../application/use-cases/habitation/list-habitations.use-case";
import { FindHabitationByIdUseCase } from "../../application/use-cases/habitation/find-habitation-by-id.use-case";
import { UpdateHabitationUseCase } from "../../application/use-cases/habitation/update-habitation.use-case";
import { DeleteHabitationUseCase } from "../../application/use-cases/habitation/delete-habitation.use-case";
import { CreateHabitationInput, UpdateHabitationInput } from "../../application/dtos/habitation.dto";

export class HabitationController {
  constructor(
    private createUseCase: CreateHabitationUseCase,
    private listUseCase: ListHabitationsUseCase,
    private findByIdUseCase: FindHabitationByIdUseCase,
    private updateUseCase: UpdateHabitationUseCase,
    private deleteUseCase: DeleteHabitationUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateHabitationInput;
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
    const input = c.get("validData") as UpdateHabitationInput;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Habitación actualizada exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Habitación eliminada exitosamente"), 200);
  }
}
