import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateReservaUseCase } from "../../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaUseCase } from "../../application/use-cases/reserva/list-reserva.use-case";
import { FindReservaByIdUseCase } from "../../application/use-cases/reserva/find-reserva-by-id.use-case";
import { UpdateReservaUseCase } from "../../application/use-cases/reserva/update-reserva.use-case";
import { DeleteReservaUseCase } from "../../application/use-cases/reserva/delete-reserva.use-case";
import { CancelReservaUseCase } from "../../application/use-cases/reserva/cancel-reserva.use-case";
import { UpdateEstadoReservaUseCase } from "../../application/use-cases/reserva/update-estado-reserva.use-case";
import {
  CreateReservaDto,
  UpdateReservaDto,
  CancelReservaDto,
  UpdateEstadoReservaDto,
  toReservaDto,
} from "../../application/dtos/reserva.dto";

@injectable()
export class ReservaController {
  constructor(
    private createUseCase: CreateReservaUseCase,
    private listUseCase: ListReservaUseCase,
    private findByIdUseCase: FindReservaByIdUseCase,
    private updateUseCase: UpdateReservaUseCase,
    private deleteUseCase: DeleteReservaUseCase,
    private cancelUseCase: CancelReservaUseCase,
    private updateEstadoUseCase: UpdateEstadoReservaUseCase,
  ) {}

  async create(c: AppContext) {
    const validData = c.get("validData") as Record<string, unknown>;
    const input: CreateReservaDto = {
      huespedId: validData.huespedId as string,
      habitacionId: validData.habitacionId as string,
      tarifaId: validData.tarifaId as string,
      fechaEntrada: new Date(validData.fechaEntrada as string),
      fechaSalida: new Date(validData.fechaSalida as string),
      adultos: validData.adultos as number,
      ninos: validData.ninos as number,
      montoDescuento: validData.montoDescuento as number | undefined,
    };

    const reserva = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Reserva creada exitosamente", toReservaDto(reserva)), 201);
  }

  async list(c: AppContext) {
    const reservas = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Reservas obtenidas exitosamente", reservas), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const reserva = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Reserva encontrada", reserva), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as Record<string, unknown>;

    const input: UpdateReservaDto = {
      huespedId: validData.huespedId as string | undefined,
      habitacionId: validData.habitacionId as string | undefined,
      tarifaId: validData.tarifaId as string | undefined,
      pagoId: validData.pagoId as string | null | undefined,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada as string) : undefined,
      fechaSalida: validData.fechaSalida ? new Date(validData.fechaSalida as string) : undefined,
      adultos: validData.adultos as number | undefined,
      ninos: validData.ninos as number | undefined,
      montoDescuento: validData.montoDescuento as number | undefined,
      estado: validData.estado as UpdateReservaDto["estado"],
    };

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
