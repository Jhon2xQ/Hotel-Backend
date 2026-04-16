import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/create-insumo-cocina.use-case";
import { ListInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/list-insumo-cocina.use-case";
import { FindInsumoCocinaByIdUseCase } from "../../application/use-cases/insumo-cocina/find-insumo-cocina-by-id.use-case";
import { UpdateInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/update-insumo-cocina.use-case";
import { DeleteInsumoCocinaUseCase } from "../../application/use-cases/insumo-cocina/delete-insumo-cocina.use-case";
import { RegisterMovimientoCocinaUseCase } from "../../application/use-cases/insumo-cocina/register-movimiento-cocina.use-case";
import { ListMovimientosCocinaUseCase } from "../../application/use-cases/insumo-cocina/list-movimientos-cocina.use-case";
import { CreateInsumoCocinaDto, UpdateInsumoCocinaDto, CreateMovimientoCocinaDto, MovimientoCocinaFiltersDto } from "../../application/dtos/insumo-cocina.dto";

@injectable()
export class InsumoCocinaController {
  constructor(
    private createUseCase: CreateInsumoCocinaUseCase,
    private listUseCase: ListInsumoCocinaUseCase,
    private findByIdUseCase: FindInsumoCocinaByIdUseCase,
    private updateUseCase: UpdateInsumoCocinaUseCase,
    private deleteUseCase: DeleteInsumoCocinaUseCase,
    private registroMovimientoUseCase: RegisterMovimientoCocinaUseCase,
    private listMovimientosUseCase: ListMovimientosCocinaUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateInsumoCocinaDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Insumo de cocina creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const result = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Insumos de cocina obtenidos exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Insumo de cocina encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdateInsumoCocinaDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Insumo de cocina actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Insumo de cocina eliminado exitosamente"), 200);
  }

  async registrarMovimiento(c: AppContext) {
    const input = c.get("validData") as CreateMovimientoCocinaDto;
    const result = await this.registroMovimientoUseCase.execute(input);
    return c.json(ApiResponse.success("Movimiento registrado exitosamente", result), 201);
  }

  async listarMovimientos(c: AppContext) {
    const input = c.get("validData") as MovimientoCocinaFiltersDto;
    const result = await this.listMovimientosUseCase.execute(input);
    return c.json(ApiResponse.success("Movimientos obtenidos exitosamente", result), 200);
  }
}