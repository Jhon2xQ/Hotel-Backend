import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../domain/exceptions/insumo-cocina.exception";
import { UpdateInsumoCocinaDto, InsumoCocinaDto, toInsumoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateInsumoCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(id: string, data: UpdateInsumoCocinaDto): Promise<InsumoCocinaDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw InsumoCocinaException.notFoundById(id);
    }

    if (data.codigo && data.codigo !== existing.codigo) {
      const codigoExists = await this.repository.findByCodigo(data.codigo);
      if (codigoExists) {
        throw InsumoCocinaException.conflictByCodigo(data.codigo);
      }
    }

    const insumo = await this.repository.update(id, {
      codigo: data.codigo,
      nombre: data.nombre,
      unidad: data.unidad,
      stockActual: data.stock_actual,
      stockMinimo: data.stock_minimo,
      notas: data.notas ?? null,
      activo: data.activo,
    });

    return toInsumoCocinaDto(insumo);
  }
}