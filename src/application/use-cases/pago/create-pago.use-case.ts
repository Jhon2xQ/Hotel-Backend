import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { IPersonalRepository } from "../../../domain/interfaces/personal.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { CreatePagoInput, PagoOutput } from "../../dtos/pago.dto";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../../domain/entities/pago.entity";

export class CreatePagoUseCase {
  constructor(
    private repository: IPagoRepository,
    private personalRepository: IPersonalRepository,
  ) {}

  async execute(input: CreatePagoInput): Promise<PagoOutput> {
    // Validate monto is positive
    if (input.monto <= 0) {
      throw PagoException.invalidAmount();
    }

    // Validate personal exists if provided
    if (input.recibido_por_id) {
      const personal = await this.personalRepository.findById(input.recibido_por_id);
      if (!personal) {
        throw PagoException.personalNotFound();
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
      notas: input.notas,
    });

    return pago.toOutput();
  }
}
