import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateHuespedUseCase } from "../../application/use-cases/huesped/create-huesped.use-case";
import { ListHuespedPaginatedUseCase } from "../../application/use-cases/huesped/list-huesped-paginated.use-case";
import { FindHuespedByIdUseCase } from "../../application/use-cases/huesped/find-huesped-by-id.use-case";
import { UpdateHuespedUseCase } from "../../application/use-cases/huesped/update-huesped.use-case";
import { DeleteHuespedUseCase } from "../../application/use-cases/huesped/delete-huesped.use-case";
import type { CreateHuespedDto, UpdateHuespedDto } from "../../application/dtos/huesped.dto";
import type { HuespedQuery } from "../schemas/huesped.schema";

@injectable()
export class HuespedController {
  constructor(
    private readonly createUseCase: CreateHuespedUseCase,
    private readonly listPaginatedUseCase: ListHuespedPaginatedUseCase,
    private readonly findByIdUseCase: FindHuespedByIdUseCase,
    private readonly updateUseCase: UpdateHuespedUseCase,
    private readonly deleteUseCase: DeleteHuespedUseCase,
  ) {}

  async create(c: AppContext) {
    const validData = c.get("validData") as CreateHuespedDto;
    const huesped = await this.createUseCase.execute(validData);
    return c.json(ApiResponse.success("Huésped creado exitosamente", huesped), 201);
  }

  async listPaginated(c: AppContext) {
    const validData = c.get("validData") as HuespedQuery;
    const result = await this.listPaginatedUseCase.execute(validData);
    return c.json(ApiResponse.success("Huéspedes obtenidos exitosamente", result), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const huesped = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Huésped encontrado", huesped), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const validData = c.get("validData") as UpdateHuespedDto;
    const huesped = await this.updateUseCase.execute(id, validData);
    return c.json(ApiResponse.success("Huésped actualizado exitosamente", huesped), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Huésped eliminado exitosamente"), 200);
  }
}
