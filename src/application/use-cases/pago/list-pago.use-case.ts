import { inject, injectable } from "tsyringe";
import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoOutput } from "../../dtos/pago.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListPagoUseCase {
  constructor(@inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository) {}

  async execute(): Promise<PagoOutput[]> {
    const pagos = await this.repository.findAll();
    return pagos.map((pago) => pago.toOutput());
  }
}
