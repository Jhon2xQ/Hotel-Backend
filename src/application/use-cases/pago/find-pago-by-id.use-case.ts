import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { PagoOutput } from "../../dtos/pago.dto";

export class FindPagoByIdUseCase {
  constructor(private repository: IPagoRepository) {}

  async execute(id: string): Promise<PagoOutput> {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw PagoException.notFoundById();
    }
    return pago.toOutput();
  }
}
