import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../domain/exceptions/insumo-bar.exception";
import { UpdateInsumoBarDto, InsumoBarDto, toInsumoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateInsumoBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(id: string, data: UpdateInsumoBarDto): Promise<InsumoBarDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw InsumoBarException.notFoundById(id);
    }

    if (data.codigo && data.codigo !== existing.codigo) {
      const codigoExists = await this.repository.findByCodigo(data.codigo);
      if (codigoExists) {
        throw InsumoBarException.conflictByCodigo(data.codigo);
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

    return toInsumoBarDto(insumo);
  }
}