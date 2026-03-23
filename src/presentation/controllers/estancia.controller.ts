import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateEstanciaUseCase } from "../../application/use-cases/estancia/create-estancia.use-case";
import { ListEstanciaUseCase } from "../../application/use-cases/estancia/list-estancia.use-case";
import { FindEstanciaByIdUseCase } from "../../application/use-cases/estancia/find-estancia-by-id.use-case";
import { UpdateEstanciaUseCase } from "../../application/use-cases/estancia/update-estancia.use-case";
import { DeleteEstanciaUseCase } from "../../application/use-cases/estancia/delete-estancia.use-case";
import { CheckoutEstanciaUseCase } from "../../application/use-cases/estancia/checkout-estancia.use-case";
import { CreateEstanciaInput, UpdateEstanciaInput, CheckoutEstanciaInput } from "../../application/dtos/estancia.dto";

export class EstanciaController {
  constructor(
    private createUseCase: CreateEstanciaUseCase,
    private listUseCase: ListEstanciaUseCase,
    private findByIdUseCase: FindEstanciaByIdUseCase,
    private updateUseCase: UpdateEstanciaUseCase,
    private deleteUseCase: DeleteEstanciaUseCase,
    private checkoutUseCase: CheckoutEstanciaUseCase,
  ) {}

  async create(c: AppContext) {
    const validData = c.get("validData") as any;
    const input: CreateEstanciaInput = {
      reservaId: validData.reservaId,
      habitacionId: validData.habitacionId,
      huespedId: validData.huespedId,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada) : undefined,
      fechaSalida: validData.fechaSalida ? new Date(validData.fechaSalida) : null,
      estado: validData.estado,
      notas: validData.notas,
    };

    const estancia = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Estancia creada exitosamente", estancia.toOutput()), 201);
  }

  async list(c: AppContext) {
    const estancias = await this.listUseCase.execute();
    const output = estancias.map((e) => e.toOutput());
    return c.json(ApiResponse.success("Estancias obtenidas exitosamente", output), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const estancia = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Estancia encontrada", estancia.toOutput()), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as any;

    const input: UpdateEstanciaInput = {
      reservaId: validData.reservaId,
      habitacionId: validData.habitacionId,
      huespedId: validData.huespedId,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada) : undefined,
      fechaSalida:
        validData.fechaSalida !== undefined
          ? validData.fechaSalida
            ? new Date(validData.fechaSalida)
            : null
          : undefined,
      estado: validData.estado,
      notas: validData.notas,
    };

    const estancia = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Estancia actualizada exitosamente", estancia.toOutput()), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Estancia eliminada exitosamente"), 200);
  }

  async checkout(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as CheckoutEstanciaInput;
    const input: CheckoutEstanciaInput = {
      fechaSalida: new Date(validData.fechaSalida),
    };
    const estancia = await this.checkoutUseCase.execute(id, input);
    return c.json(ApiResponse.success("Checkout realizado exitosamente", estancia.toOutput()), 200);
  }
}
