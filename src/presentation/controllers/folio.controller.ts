import { injectable } from "tsyringe";
import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreateFolioUseCase } from "../../application/use-cases/folio/create-folio.use-case";
import { ListFolioUseCase } from "../../application/use-cases/folio/list-folio.use-case";
import { FindFolioByIdUseCase } from "../../application/use-cases/folio/find-folio-by-id.use-case";
import { UpdateFolioUseCase } from "../../application/use-cases/folio/update-folio.use-case";
import { DeleteFolioUseCase } from "../../application/use-cases/folio/delete-folio.use-case";
import { CloseFolioUseCase } from "../../application/use-cases/folio/close-folio.use-case";
import type { CreateFolioDto, UpdateFolioDto } from "../../application/dtos/folio.dto";

@injectable()
export class FolioController {
  constructor(
    private readonly createUseCase: CreateFolioUseCase,
    private readonly listUseCase: ListFolioUseCase,
    private readonly findByIdUseCase: FindFolioByIdUseCase,
    private readonly updateUseCase: UpdateFolioUseCase,
    private readonly deleteUseCase: DeleteFolioUseCase,
    private readonly closeUseCase: CloseFolioUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreateFolioDto;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Folio creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Folios obtenidos exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const id = c.req.param("id") as string;
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Folio encontrado", result), 200);
  }

  async update(c: AppContext) {
    const id = c.req.param("id") as string;
    const input = c.get("validData") as UpdateFolioDto;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Folio actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const id = c.req.param("id") as string;
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Folio eliminado exitosamente"), 200);
  }

  async close(c: AppContext) {
    const id = c.req.param("id") as string;
    const input = c.get("validData") as { observacion?: string };
    const result = await this.closeUseCase.execute(id, input.observacion);
    return c.json(ApiResponse.success("Folio cerrado exitosamente", result), 200);
  }
}