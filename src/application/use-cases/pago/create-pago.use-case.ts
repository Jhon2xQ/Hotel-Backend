import { inject, injectable } from "tsyringe";
import type { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import type { IUserRepository } from "../../../domain/interfaces/user.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { CreatePagoInput, PagoOutput } from "../../dtos/pago.dto";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../../domain/entities/pago.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreatePagoUseCase {
  constructor(
    @inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository,
    @inject(DI_TOKENS.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: CreatePagoInput): Promise<PagoOutput> {
    // Validate monto is positive
    if (input.monto <= 0) {
      throw PagoException.invalidAmount();
    }

    // Validate user exists if provided
    if (input.recibido_por_id) {
      const user = await this.userRepository.findById(input.recibido_por_id);
      if (!user) {
        throw PagoException.userNotFound();
      }
    }

    const pago = await this.repository.create({
      concepto: input.concepto as ConceptoPago,
      estado: input.estado as EstadoPago | undefined,
      fechaPago: input.fecha_pago,
      monto: input.monto,
      moneda: input.moneda,
      metodo: input.metodo as MetodoPago,
      recibidoPorId: input.recibido_por_id,
      observacion: input.observacion,
    });

    return pago.toOutput();
  }
}
