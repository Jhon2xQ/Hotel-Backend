import { inject, injectable } from "tsyringe";
import type { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { TarifaDto, toTarifaDto } from "../../dtos/tarifa.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindTarifaByIdUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(id: string): Promise<TarifaDto> {
    const tarifa = await this.repository.findById(id);

    if (!tarifa) {
      throw TarifaException.notFoundById();
    }

    return toTarifaDto(tarifa);
  }
}
