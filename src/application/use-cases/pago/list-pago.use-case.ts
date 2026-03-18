import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoOutput } from "../../dtos/pago.dto";

export class ListPagoUseCase {
  constructor(private repository: IPagoRepository) {}

  async execute(): Promise<PagoOutput[]> {
    const pagos = await this.repository.findAll();
    return pagos.map((pago) => pago.toOutput());
  }
}
