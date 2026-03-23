import { TarifaException } from "../../../domain/exceptions/tarifa.exception";
import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { CreateTarifaInput, TarifaOutput } from "../../dtos/tarifa.dto";

export class CreateTarifaUseCase {
  constructor(private repository: ITarifaRepository) {}

  async execute(input: CreateTarifaInput): Promise<TarifaOutput> {
    if (input.precio_noche <= 0) {
      throw TarifaException.invalidPrecio();
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
