import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateReservaUseCase } from "../../application/use-cases/reserva/create-reserva.use-case";
import { ListReservaUseCase } from "../../application/use-cases/reserva/list-reserva.use-case";
import { FindReservaByIdUseCase } from "../../application/use-cases/reserva/find-reserva-by-id.use-case";
import { UpdateReservaUseCase } from "../../application/use-cases/reserva/update-reserva.use-case";
import { DeleteReservaUseCase } from "../../application/use-cases/reserva/delete-reserva.use-case";
import { CancelReservaUseCase } from "../../application/use-cases/reserva/cancel-reserva.use-case";
import { CreateReservaInput, UpdateReservaInput, CancelReservaInput } from "../../application/dtos/reserva.dto";

export class ReservaController {
  constructor(
    private createUseCase: CreateReservaUseCase,
    private listUseCase: ListReservaUseCase,
    private findByIdUseCase: FindReservaByIdUseCase,
    private updateUseCase: UpdateReservaUseCase,
    private deleteUseCase: DeleteReservaUseCase,
    private cancelUseCase: CancelReservaUseCase,
  ) {}

  async create(c: AppContext) {
    const validData = c.get("validData") as any;
    const input: CreateReservaInput = {
      huespedId: validData.huespedId,
      habitacionId: validData.habitacionId,
      tarifaId: validData.tarifaId,
      fechaEntrada: new Date(validData.fechaEntrada),
      fechaSalida: new Date(validData.fechaSalida),
      adultos: validData.adultos,
      ninos: validData.ninos,
      montoDescuento: validData.montoDescuento,
    };

    const reserva = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Reserva creada exitosamente", reserva.toOutput()), 201);
  }

  async list(c: AppContext) {
    const reservas = await this.listUseCase.execute();
    const output = reservas.map((r) => r.toOutput());
    return c.json(ApiResponse.success("Reservas obtenidas exitosamente", output), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const reserva = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Reserva encontrada", reserva.toOutput()), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as any;

    const input: UpdateReservaInput = {
      huespedId: validData.huespedId,
      habitacionId: validData.habitacionId,
      tarifaId: validData.tarifaId,
      pagoId: validData.pagoId,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada) : undefined,
      fechaSalida: validData.fechaSalida ? new Date(validData.fechaSalida) : undefined,
      adultos: validData.adultos,
      ninos: validData.ninos,
      montoDescuento: validData.montoDescuento,
      estado: validData.estado,
    };

    const reserva = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Reserva actualizada exitosamente", reserva.toOutput()), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Reserva eliminada exitosamente"), 200);
  }

  async cancel(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as CancelReservaInput;
    const reserva = await this.cancelUseCase.execute(id, validData);
    return c.json(ApiResponse.success("Reserva cancelada exitosamente", reserva.toOutput()), 200);
  }
}
