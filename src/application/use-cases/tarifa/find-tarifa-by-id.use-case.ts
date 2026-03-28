import { inject, injectable } from "tsyringe";
import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { TarifaOutput } from "../../dtos/tarifa.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindTarifaByIdUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(id: string): Promise<TarifaOutput> {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw TarifaException.notFoundById();
    }

    return tarifa.toOutput();
  }
}
