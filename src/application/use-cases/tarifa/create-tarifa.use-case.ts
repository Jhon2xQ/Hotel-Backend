import { inject, injectable } from "tsyringe";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { CreateTarifaInput, TarifaOutput } from "../../dtos/tarifa.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateTarifaUseCase {
  constructor(@inject(DI_TOKENS.ITarifaRepository) private repository: ITarifaRepository) {}

  async execute(input: CreateTarifaInput): Promise<TarifaOutput> {
    if (input.precio_noche <= 0) {
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
      precioNoche: input.precio_noche,
      IVA: input.iva ?? null,
      cargoServicios: input.cargo_servicios ?? null,
      moneda: input.moneda ?? "USD",
    });

    return tarifa.toOutput();
  }
}
