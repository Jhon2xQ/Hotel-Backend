import { inject, injectable } from "tsyringe";
import type { AppContext } from "../../common/types/app.types";
import type { CreateInternacionalizacionDto, UpdateInternacionalizacionDto } from "../../application/dtos/internacionalizacion.dto";
import { CreateInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/create-internacionalizacion.use-case";
import { FindInternacionalizacionByHabitacionUseCase } from "../../application/use-cases/internacionalizacion/find-internacionalizacion-by-habitacion.use-case";
import { UpdateInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/update-internacionalizacion.use-case";
import { DeleteInternacionalizacionUseCase } from "../../application/use-cases/internacionalizacion/delete-internacionalizacion.use-case";
import { ApiResponse } from "../api.response";

@injectable()
export class InternacionalizacionController {
  constructor(
    private createUseCase: CreateInternacionalizacionUseCase,
    private findUseCase: FindInternacionalizacionByHabitacionUseCase,
    private updateUseCase: UpdateInternacionalizacionUseCase,
    private deleteUseCase: DeleteInternacionalizacionUseCase,
  ) {}

  async create(c: AppContext): Promise<Response> {
    const input = c.get("validData") as CreateInternacionalizacionDto;
    const habitacionId = c.req.param("habitacionId") as string;
    const result = await this.createUseCase.execute(habitacionId, input);
    return c.json(ApiResponse.success("Internacionalización creada exitosamente", result), 201);
  }

  async findByHabitacion(c: AppContext): Promise<Response> {
    const habitacionId = c.req.param("habitacionId") as string;
    const result = await this.findUseCase.execute(habitacionId);
    return c.json(ApiResponse.success("Internacionalización encontrada", result), 200);
  }

  async update(c: AppContext): Promise<Response> {
    const input = c.get("validData") as UpdateInternacionalizacionDto;
    const habitacionId = c.req.param("habitacionId") as string;
    const result = await this.updateUseCase.execute(habitacionId, input);
    return c.json(ApiResponse.success("Internacionalización actualizada exitosamente", result), 200);
  }

  async delete(c: AppContext): Promise<Response> {
    const habitacionId = c.req.param("habitacionId") as string;
    await this.deleteUseCase.execute(habitacionId);
    return c.json(ApiResponse.success("Internacionalización eliminada exitosamente", null), 200);
  }
}