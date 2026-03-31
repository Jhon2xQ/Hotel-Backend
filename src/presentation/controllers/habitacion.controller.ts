import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateHabitacionUseCase } from "../../application/use-cases/habitacion/create-habitacion.use-case";
import { ListHabitacionUseCase } from "../../application/use-cases/habitacion/list-habitacion.use-case";
import { ListHabitacionPaginatedUseCase } from "../../application/use-cases/habitacion/list-habitacion-paginated.use-case";
import { FindHabitacionByIdUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { FindHabitacionConFechasReservaUseCase } from "../../application/use-cases/habitacion/find-habitacion-con-fechas-reserva.use-case";
import { UpdateHabitacionUseCase } from "../../application/use-cases/habitacion/update-habitacion.use-case";
import { UpdateHabitacionStatusUseCase } from "../../application/use-cases/habitacion/update-habitacion-status.use-case";
import { DeleteHabitacionUseCase } from "../../application/use-cases/habitacion/delete-habitacion.use-case";
import { SearchAvailableHabitacionesUseCase } from "../../application/use-cases/habitacion/search-available-habitaciones.use-case";
import { FindHabitacionByIdWithPriceUseCase } from "../../application/use-cases/habitacion/find-habitacion-by-id-with-price.use-case";
import {
  CreateHabitacionDto,
  UpdateHabitacionDto,
  UpdateHabitacionStatusDto,
  SearchAvailableHabitacionesDto,
} from "../../application/dtos/habitacion.dto";
import type { ListHabitacionQuery } from "../schemas/habitacion.schema";
import type { HabitacionDetailQuery } from "../schemas/habitacion.schema";
import type { EstadoReserva } from "../../domain/entities/reserva.entity";

@injectable()
export class HabitacionController {
  constructor(
    private createUseCase: CreateHabitacionUseCase,
    private listUseCase: ListHabitacionUseCase,
    private listPaginatedUseCase: ListHabitacionPaginatedUseCase,
    private findByIdUseCase: FindHabitacionByIdUseCase,
    private findByIdConFechasReservaUseCase: FindHabitacionConFechasReservaUseCase,
    private updateUseCase: UpdateHabitacionUseCase,
    private updateStatusUseCase: UpdateHabitacionStatusUseCase,
    private deleteUseCase: DeleteHabitacionUseCase,
    private searchAvailableUseCase: SearchAvailableHabitacionesUseCase,
    private findByIdWithPriceUseCase: FindHabitacionByIdWithPriceUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateHabitacionDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Habitación creada exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Habitaciones obtenidas exitosamente", results), 200);
  }

  async listPaginated(c: AppContext) {
    const validData = c.get("validData") as ListHabitacionQuery;
    const result = await this.listPaginatedUseCase.execute(validData);
    return c.json(ApiResponse.success("Habitaciones obtenidas exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const validData = c.get("validData") as HabitacionDetailQuery;
    const result = await this.findByIdConFechasReservaUseCase.execute(id, validData.tipo_reserva as EstadoReserva[]);
    return c.json(ApiResponse.success("Habitación encontrada", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateHabitacionDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Habitación actualizada exitosamente", result), 200);
  }

  async updateStatus(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateHabitacionStatusDto;
    const result = await this.updateStatusUseCase.execute(id, input);
    return c.json(ApiResponse.success("Estado de habitación actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Habitación eliminada exitosamente"), 200);
  }

  async searchAvailable(c: AppContext) {
    const input = c.get("validData") as SearchAvailableHabitacionesDto;
    const results = await this.searchAvailableUseCase.execute(input);
    return c.json(ApiResponse.success("Habitaciones disponibles obtenidas exitosamente", results), 200);
  }

  async findByIdWithPrice(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdWithPriceUseCase.execute(id);
    return c.json(ApiResponse.success("Habitación con precio obtenida exitosamente", result), 200);
  }
}
