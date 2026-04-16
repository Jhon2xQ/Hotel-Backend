import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../domain/exceptions/insumo-cocina.exception";
import { InsumoCocinaDto, toInsumoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindInsumoCocinaByIdUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(id: string): Promise<InsumoCocinaDto> {
    const insumo = await this.repository.findById(id);

    if (!insumo) {
      throw InsumoCocinaException.notFoundById(id);
    }

    return toInsumoCocinaDto(insumo);
  }
}