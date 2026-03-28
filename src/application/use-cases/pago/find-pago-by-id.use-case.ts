import { inject, injectable } from "tsyringe";
import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { PagoOutput } from "../../dtos/pago.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindPagoByIdUseCase {
  constructor(@inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository) {}

  async execute(id: string): Promise<PagoOutput> {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw PagoException.notFoundById();
    }
    return pago.toOutput();
  }
}
