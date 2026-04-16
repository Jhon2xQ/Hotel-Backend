import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { MovimientoCocinaFiltersDto, MovimientoCocinaDto, toMovimientoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListMovimientosCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(filters: MovimientoCocinaFiltersDto): Promise<MovimientoCocinaDto[]> {
    const movimientos = await this.repository.findMovimientos({
      insumoId: filters.insumo_id,
      tipo: filters.tipo,
      fechaInicio: filters.fecha_inicio ? new Date(filters.fecha_inicio) : undefined,
      fechaFin: filters.fecha_fin ? new Date(filters.fecha_fin) : undefined,
    });

    return movimientos.map(toMovimientoCocinaDto);
  }
}