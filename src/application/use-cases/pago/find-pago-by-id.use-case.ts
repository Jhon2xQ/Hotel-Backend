import { inject, injectable } from "tsyringe";
import type { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { PagoDto, toPagoDto } from "../../dtos/pago.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindPagoByIdUseCase {
  constructor(@inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository) {}

  async execute(id: string): Promise<PagoDto> {
    const pago = await this.repository.findById(id);

    if (!pago) {
      throw PagoException.notFoundById();
    }

    return toPagoDto(pago);
  }
}
