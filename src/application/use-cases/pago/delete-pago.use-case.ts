import { inject, injectable } from "tsyringe";
import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class DeletePagoUseCase {
  constructor(@inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository) {}

  async execute(id: string): Promise<void> {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw PagoException.notFoundById();
    }

    await this.repository.delete(id);
  }
}
