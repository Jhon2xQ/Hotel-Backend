import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateInsumoBarUseCase } from "../../application/use-cases/insumo-bar/create-insumo-bar.use-case";
import { ListInsumoBarUseCase } from "../../application/use-cases/insumo-bar/list-insumo-bar.use-case";
import { FindInsumoBarByIdUseCase } from "../../application/use-cases/insumo-bar/find-insumo-bar-by-id.use-case";
import { UpdateInsumoBarUseCase } from "../../application/use-cases/insumo-bar/update-insumo-bar.use-case";
import { DeleteInsumoBarUseCase } from "../../application/use-cases/insumo-bar/delete-insumo-bar.use-case";
import { RegisterMovimientoBarUseCase } from "../../application/use-cases/insumo-bar/register-movimiento-bar.use-case";
import { ListMovimientosBarUseCase } from "../../application/use-cases/insumo-bar/list-movimientos-bar.use-case";
import { CreateInsumoBarDto, UpdateInsumoBarDto, CreateMovimientoBarDto, MovimientoBarFiltersDto } from "../../application/dtos/insumo-bar.dto";

@injectable()
export class InsumoBarController {
  constructor(
    private createUseCase: CreateInsumoBarUseCase,
    private listUseCase: ListInsumoBarUseCase,
    private findByIdUseCase: FindInsumoBarByIdUseCase,
    private updateUseCase: UpdateInsumoBarUseCase,
    private deleteUseCase: DeleteInsumoBarUseCase,
    private registroMovimientoUseCase: RegisterMovimientoBarUseCase,
    private listMovimientosUseCase: ListMovimientosBarUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateInsumoBarDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Insumo de bar creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const result = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Insumos de bar obtenidos exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Insumo de bar encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateInsumoBarDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Insumo de bar actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Insumo de bar eliminado exitosamente"), 200);
  }

  async registrarMovimiento(c: AppContext) {
    const input = c.get("validData") as CreateMovimientoBarDto;
    const result = await this.registroMovimientoUseCase.execute(input);
    return c.json(ApiResponse.success("Movimiento registrado exitosamente", result), 201);
  }

  async listarMovimientos(c: AppContext) {
    const input = c.get("validData") as MovimientoBarFiltersDto;
    const result = await this.listMovimientosUseCase.execute(input);
    return c.json(ApiResponse.success("Movimientos obtenidos exitosamente", result), 200);
  }
}