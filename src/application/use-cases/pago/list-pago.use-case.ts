import { inject, injectable } from "tsyringe";
import type { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoDto, toPagoDto } from "../../dtos/pago.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListPagoUseCase {
  constructor(@inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository) {}

  async execute(): Promise<PagoDto[]> {
    const pagos = await this.repository.findAll();
    return pagos.map((pago) => toPagoDto(pago));
  }
}
