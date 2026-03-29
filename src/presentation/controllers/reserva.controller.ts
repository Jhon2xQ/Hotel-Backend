import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateReservaUseCase } from "../../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaPaginatedUseCase } from "../../application/use-cases/reserva/list-reserva-paginated.use-case";
import { FindReservaByIdUseCase } from "../../application/use-cases/reserva/find-reserva-by-id.use-case";
import { UpdateReservaUseCase } from "../../application/use-cases/reserva/update-reserva.use-case";
import { DeleteReservaUseCase } from "../../application/use-cases/reserva/delete-reserva.use-case";
import { CancelReservaUseCase } from "../../application/use-cases/reserva/cancel-reserva.use-case";
import { UpdateEstadoReservaUseCase } from "../../application/use-cases/reserva/update-estado-reserva.use-case";
import { CreateReservaDto, UpdateReservaDto, CancelReservaDto, UpdateEstadoReservaDto, toReservaDto } from "../../application/dtos/reserva.dto";
import type { ReservaQuery } from "../schemas/reserva.schema";

@injectable()
export class ReservaController {
  constructor(
    private createUseCase: CreateReservaUseCase,
    private listPaginatedUseCase: ListReservaPaginatedUseCase,
    private findByIdUseCase: FindReservaByIdUseCase,
    private updateUseCase: UpdateReservaUseCase,
    private deleteUseCase: DeleteReservaUseCase,
    private cancelUseCase: CancelReservaUseCase,
    private updateEstadoUseCase: UpdateEstadoReservaUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateReservaDto;
    const reserva = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Reserva creada exitosamente", toReservaDto(reserva)), 201);
  }

  async listPaginated(c: AppContext) {
    const validData = c.get("validData") as ReservaQuery;
    const result = await this.listPaginatedUseCase.execute(validData);
    return c.json(ApiResponse.success("Reservas obtenidas exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const reserva = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Reserva encontrada", reserva), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const input = c.get("validData") as UpdateReservaDto;
    const reserva = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Reserva actualizada exitosamente", toReservaDto(reserva)), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Reserva eliminada exitosamente"), 200);
  }

  async cancel(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as CancelReservaDto;
    const reserva = await this.cancelUseCase.execute(id, validData);
    return c.json(ApiResponse.success("Reserva cancelada exitosamente", toReservaDto(reserva)), 200);
  }

  async updateEstado(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as UpdateEstadoReservaDto;
    const reserva = await this.updateEstadoUseCase.execute(id, validData);
    return c.json(ApiResponse.success("Estado de reserva actualizado exitosamente", toReservaDto(reserva)), 200);
  }
}
