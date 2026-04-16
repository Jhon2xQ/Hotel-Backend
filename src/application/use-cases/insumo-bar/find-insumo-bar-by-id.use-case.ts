import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../domain/exceptions/insumo-bar.exception";
import { InsumoBarDto, toInsumoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindInsumoBarByIdUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(id: string): Promise<InsumoBarDto> {
    const insumo = await this.repository.findById(id);

    if (!insumo) {
      throw InsumoBarException.notFoundById(id);
    }

    return toInsumoBarDto(insumo);
  }
}