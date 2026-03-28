import { inject, injectable } from "tsyringe";
import type { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaDto, toTarifaDto } from "../../dtos/tarifa.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListTarifaUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(): Promise<TarifaDto[]> {
    const tarifas = await this.repository.findAll();
    return tarifas.map((tarifa) => toTarifaDto(tarifa));
  }
}
