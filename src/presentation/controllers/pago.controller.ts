import { AppContext } from "../../common/types/app.types";
import { ApiResponse } from "../api.response";
import { CreatePagoUseCase } from "../../application/use-cases/pago/create-pago.use-case";
import { ListPagoUseCase } from "../../application/use-cases/pago/list-pago.use-case";
import { FindPagoByIdUseCase } from "../../application/use-cases/pago/find-pago-by-id.use-case";
import { UpdatePagoUseCase } from "../../application/use-cases/pago/update-pago.use-case";
import { DeletePagoUseCase } from "../../application/use-cases/pago/delete-pago.use-case";
import { CreatePagoInput, UpdatePagoInput } from "../../application/dtos/pago.dto";

export class PagoController {
  constructor(
    private createUseCase: CreatePagoUseCase,
    private listUseCase: ListPagoUseCase,
    private findByIdUseCase: FindPagoByIdUseCase,
    private updateUseCase: UpdatePagoUseCase,
    private deleteUseCase: DeletePagoUseCase,
  ) {}

  async create(c: AppContext) {
    const input = c.get("validData") as CreatePagoInput;
    const result = await this.createUseCase.execute(input);
    return c.json(ApiResponse.success("Pago creado exitosamente", result), 201);
  }

  async list(c: AppContext) {
    const results = await this.listUseCase.execute();
    return c.json(ApiResponse.success("Pagos obtenidos exitosamente", results), 200);
  }

  async findById(c: AppContext) {
    const { id } = c.req.param();
    const result = await this.findByIdUseCase.execute(id);
    return c.json(ApiResponse.success("Pago encontrado", result), 200);
  }

  async update(c: AppContext) {
    const { id } = c.req.param();
    const input = c.get("validData") as UpdatePagoInput;
    const result = await this.updateUseCase.execute(id, input);
    return c.json(ApiResponse.success("Pago actualizado exitosamente", result), 200);
  }

  async delete(c: AppContext) {
    const { id } = c.req.param();
    await this.deleteUseCase.execute(id);
    return c.json(ApiResponse.success("Pago eliminado exitosamente"), 200);
  }
}
