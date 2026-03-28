import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateEstanciaUseCase } from "../../application/use-cases/estancia/create-estancia.use-case";
import { ListEstanciaUseCase } from "../../application/use-cases/estancia/list-estancia.use-case";
import { FindEstanciaByIdUseCase } from "../../application/use-cases/estancia/find-estancia-by-id.use-case";
import { UpdateEstanciaUseCase } from "../../application/use-cases/estancia/update-estancia.use-case";
import { DeleteEstanciaUseCase } from "../../application/use-cases/estancia/delete-estancia.use-case";
import { CheckoutEstanciaUseCase } from "../../application/use-cases/estancia/checkout-estancia.use-case";
import type { CreateEstanciaDto, UpdateEstanciaDto, CheckoutEstanciaDto } from "../../application/dtos/estancia.dto";

@injectable()
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
    const validData = c.get("validData") as Record<string, unknown>;
    const input: CreateEstanciaDto = {
      reservaId: validData.reservaId as string,
      habitacionId: validData.habitacionId as string,
      huespedId: validData.huespedId as string,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada as string) : undefined,
      fechaSalida: validData.fechaSalida ? new Date(validData.fechaSalida as string) : null,
      estado: validData.estado as CreateEstanciaDto["estado"],
      notas: validData.notas as string | null | undefined,
    };

    const estancia = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Estancia creada exitosamente", estancia), 201);
  }

  async list(c: AppContext) {
    const estancias = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Estancias obtenidas exitosamente", estancias), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const estancia = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Estancia encontrada", estancia), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as Record<string, unknown>;

    const input: UpdateEstanciaDto = {
      reservaId: validData.reservaId as string | undefined,
      habitacionId: validData.habitacionId as string | undefined,
      huespedId: validData.huespedId as string | undefined,
      fechaEntrada: validData.fechaEntrada ? new Date(validData.fechaEntrada as string) : undefined,
      fechaSalida:
        validData.fechaSalida !== undefined
          ? validData.fechaSalida
            ? new Date(validData.fechaSalida as string)
            : null
          : undefined,
      estado: validData.estado as UpdateEstanciaDto["estado"],
      notas: validData.notas as string | null | undefined,
    };

    const estancia = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Estancia actualizada exitosamente", estancia), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Estancia eliminada exitosamente"), 200);
  }

  async checkout(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as CheckoutEstanciaDto;
    const input: CheckoutEstanciaDto = {
      fechaSalida: new Date(validData.fechaSalida as unknown as string),
    };
    const estancia = await this.checkoutUseCase.execute(id, input);
    return c.json(ApiResponse.success("Checkout realizado exitosamente", estancia), 200);
  }
}
