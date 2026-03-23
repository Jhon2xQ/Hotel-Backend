import { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { TarifaOutput } from "../../dtos/tarifa.dto";

export class ListTarifaUseCase {
  constructor(private repository: ITarifaRepository) {}

  async execute(): Promise<TarifaOutput[]> {
    const tarifas = await this.repository.findAll();
    return tarifas.map((tarifa) => tarifa.toOutput());
  }
}
