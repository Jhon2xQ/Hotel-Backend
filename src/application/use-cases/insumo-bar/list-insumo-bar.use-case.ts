import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarDto, toInsumoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListInsumoBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(): Promise<InsumoBarDto[]> {
    const insumos = await this.repository.findAll();
    return insumos.map(toInsumoBarDto);
  }
}