import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { MovimientoBarFiltersDto, MovimientoBarDto, toMovimientoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListMovimientosBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(filters: MovimientoBarFiltersDto): Promise<MovimientoBarDto[]> {
    const movimientos = await this.repository.findMovimientos({
      insumoId: filters.insumo_id,
      tipo: filters.tipo,
      fechaInicio: filters.fecha_inicio ? new Date(filters.fecha_inicio) : undefined,
      fechaFin: filters.fecha_fin ? new Date(filters.fecha_fin) : undefined,
    });

    return movimientos.map(toMovimientoBarDto);
  }
}