import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreatePromocionUseCase } from "../../application/use-cases/promocion/create-promocion.use-case";
import { ListPromocionUseCase } from "../../application/use-cases/promocion/list-promocion.use-case";
import { FindPromocionByIdUseCase } from "../../application/use-cases/promocion/find-promocion-by-id.use-case";
import { UpdatePromocionUseCase } from "../../application/use-cases/promocion/update-promocion.use-case";
import { DeletePromocionUseCase } from "../../application/use-cases/promocion/delete-promocion.use-case";
import type { CreatePromocionDto, UpdatePromocionDto } from "../../application/dtos/promocion.dto";

@injectable()
export class PromocionController {
  constructor(
    private readonly createUseCase: CreatePromocionUseCase,
    private readonly listUseCase: ListPromocionUseCase,
    private readonly findByIdUseCase: FindPromocionByIdUseCase,
    private readonly updateUseCase: UpdatePromocionUseCase,
    private readonly deleteUseCase: DeletePromocionUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreatePromocionDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Promoción creada exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Promociones obtenidas exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Promoción encontrada", result), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const input = c.get("validData") as UpdatePromocionDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Promoción actualizada exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Promoción eliminada exitosamente"), 200);
  }
}
