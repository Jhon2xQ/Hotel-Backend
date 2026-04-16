import { inject, injectable } from "tsyringe";
import type { IInsumoCocinaRepository } from "../../../domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../domain/exceptions/insumo-cocina.exception";
import { CreateMovimientoCocinaDto, MovimientoCocinaDto, toMovimientoCocinaDto } from "../../dtos/insumo-cocina.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class RegisterMovimientoCocinaUseCase {
  constructor(@inject(DI_TOKENS.IInsumoCocinaRepository) private readonly repository: IInsumoCocinaRepository) {}

  async execute(data: CreateMovimientoCocinaDto): Promise<MovimientoCocinaDto> {
    const insumo = await this.repository.findById(data.insumo_id);

    if (!insumo) {
      throw InsumoCocinaException.notFoundById(data.insumo_id);
    }

    if (data.tipo === "SALIDA" && data.cantidad > insumo.stockActual) {
      throw InsumoCocinaException.insufficientStock(data.insumo_id, data.cantidad, insumo.stockActual);
    }

    const movimiento = await this.repository.createMovimiento({
      insumoId: data.insumo_id,
      tipo: data.tipo,
      cantidad: data.cantidad,
      motivoEntrada: data.motivo_entrada ?? null,
      motivoSalida: data.motivo_salida ?? null,
      notas: data.notas ?? null,
    });

    return toMovimientoCocinaDto(movimiento);
  }
}