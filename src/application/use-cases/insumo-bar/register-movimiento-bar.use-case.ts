import { inject, injectable } from "tsyringe";
import type { IInsumoBarRepository } from "../../../domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../domain/exceptions/insumo-bar.exception";
import { CreateMovimientoBarDto, MovimientoBarDto, toMovimientoBarDto } from "../../dtos/insumo-bar.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class RegisterMovimientoBarUseCase {
  constructor(@inject(DI_TOKENS.IInsumoBarRepository) private readonly repository: IInsumoBarRepository) {}

  async execute(data: CreateMovimientoBarDto): Promise<MovimientoBarDto> {
    const insumo = await this.repository.findById(data.insumo_id);

    if (!insumo) {
      throw InsumoBarException.notFoundById(data.insumo_id);
    }

    if (data.tipo === "SALIDA" && data.cantidad > insumo.stockActual) {
      throw InsumoBarException.insufficientStock(data.insumo_id, data.cantidad, insumo.stockActual);
    }

    const movimiento = await this.repository.createMovimiento({
      insumoId: data.insumo_id,
      tipo: data.tipo,
      cantidad: data.cantidad,
      motivoEntrada: data.motivo_entrada ?? null,
      motivoSalida: data.motivo_salida ?? null,
      notas: data.notas ?? null,
    });

    return toMovimientoBarDto(movimiento);
  }
}