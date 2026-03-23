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
