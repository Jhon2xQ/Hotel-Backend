import { inject, injectable } from "tsyringe";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import type { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { CreateTarifaDto, TarifaDto, toTarifaDto } from "../../dtos/tarifa.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateTarifaUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(input: CreateTarifaDto): Promise<TarifaDto> {
    if (input.precio <= 0) {
      throw TarifaException.invalidPrecio();
    }

    const tipoHabitacionExists = await this.repository.tipoHabitacionExists(input.tipo_habitacion_id);
    if (!tipoHabitacionExists) {
      throw TarifaException.tipoHabitacionNotFound();
    }

    const canalExists = await this.repository.canalExists(input.canal_id);
    if (!canalExists) {
      throw TarifaException.canalNotFound();
    }

    const tarifa = await this.repository.create({
      tipoHabitacionId: input.tipo_habitacion_id,
      canalId: input.canal_id,
      precio: input.precio,
      unidad: input.unidad ?? "noches",
      IVA: input.iva ?? null,
      cargoServicios: input.cargo_servicios ?? null,
      moneda: input.moneda ?? "USD",
    });

    return toTarifaDto(tarifa);
  }
}
