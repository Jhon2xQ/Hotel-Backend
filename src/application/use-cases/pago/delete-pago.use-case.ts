import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";

export class DeletePagoUseCase {
  constructor(private repository: IPagoRepository) {}

  async execute(id: string): Promise<void> {
    const pago = await this.repository.findById(id);
    if (!pago) {
      throw PagoException.notFoundById();
    }

    await this.repository.delete(id);
  }
}
