import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { TarifaOutput } from "../../dtos/tarifa.dto";

export class FindTarifaByIdUseCase {
  constructor(private repository: ITarifaRepository) {}

  async execute(id: string): Promise<TarifaOutput> {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw TarifaException.notFoundById();
    }

    return tarifa.toOutput();
  }
}
