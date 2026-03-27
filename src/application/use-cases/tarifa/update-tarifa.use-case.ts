import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { UpdateTarifaInput, TarifaOutput } from "../../dtos/tarifa.dto";

export class UpdateTarifaUseCase {
  constructor(private repository: ITarifaRepository) {}

  async execute(id: string, input: UpdateTarifaInput): Promise<TarifaOutput> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TarifaException.notFoundById();
    }

    if (input.precio_noche !== undefined && input.precio_noche <= 0) {
      throw TarifaException.invalidPrecio();
    }

    if (input.tipo_habitacion_id) {
      const tipoHabitacionExists = await this.repository.tipoHabitacionExists(input.tipo_habitacion_id);
      if (!tipoHabitacionExists) {
        throw TarifaException.tipoHabitacionNotFound();
      }
    }

    if (input.canal_id) {
      const canalExists = await this.repository.canalExists(input.canal_id);
      if (!canalExists) {
        throw TarifaException.canalNotFound();
      }
    }

    const updated = await this.repository.update(id, {
      tipoHabitacionId: input.tipo_habitacion_id,
      canalId: input.canal_id,
      precioNoche: input.precio_noche,
      IVA: input.iva,
      cargoServicios: input.cargo_servicios,
      moneda: input.moneda,
    });

    return updated.toOutput();
  }
}
