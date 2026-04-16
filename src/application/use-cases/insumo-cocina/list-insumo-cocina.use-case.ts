import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaDto, toInsumoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListInsumoCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(): Promise<InsumoCocinaDto[]> {
    const insumos = await this.repository.findAll();
    return insumos.map(toInsumoCocinaDto);
  }
}