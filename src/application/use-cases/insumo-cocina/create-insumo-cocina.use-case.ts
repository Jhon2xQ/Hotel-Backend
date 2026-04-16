import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../domain/exceptions/insumo-cocina.exception";
import { CreateInsumoCocinaDto, InsumoCocinaDto, toInsumoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateInsumoCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(data: CreateInsumoCocinaDto): Promise<InsumoCocinaDto> {
    const existing = await this.repository.findByCodigo(data.codigo);

    if (existing) {
      throw InsumoCocinaException.conflictByCodigo(data.codigo);
    }

    const insumo = await this.repository.create({
      codigo: data.codigo,
      nombre: data.nombre,
      unidad: data.unidad,
      stockActual: data.stock_actual,
      stockMinimo: data.stock_minimo,
      notas: data.notas ?? null,
    });

    return toInsumoCocinaDto(insumo);
  }
}