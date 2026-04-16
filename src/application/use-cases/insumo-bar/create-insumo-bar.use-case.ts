import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../domain/exceptions/insumo-bar.exception";
import { CreateInsumoBarDto, InsumoBarDto, toInsumoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateInsumoBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(data: CreateInsumoBarDto): Promise<InsumoBarDto> {
    const existing = await this.repository.findByCodigo(data.codigo);

    if (existing) {
      throw InsumoBarException.conflictByCodigo(data.codigo);
    }

    const insumo = await this.repository.create({
      codigo: data.codigo,
      nombre: data.nombre,
      unidad: data.unidad,
      stockActual: data.stock_actual,
      stockMinimo: data.stock_minimo,
      notas: data.notas ?? null,
    });

    return toInsumoBarDto(insumo);
  }
}