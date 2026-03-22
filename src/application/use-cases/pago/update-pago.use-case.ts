import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { UpdatePagoInput, PagoOutput } from "../../dtos/pago.dto";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../../domain/entities/pago.entity";

export class UpdatePagoUseCase {
  constructor(private repository: IPagoRepository) {}

  async execute(id: string, input: UpdatePagoInput): Promise<PagoOutput> {
    // Verify pago exists
    const existingPago = await this.repository.findById(id);
    if (!existingPago) {
      throw PagoException.notFoundById();
    }

    // Validate monto if provided
    if (input.monto !== undefined && input.monto <= 0) {
      throw PagoException.invalidAmount();
    }

    const pago = await this.repository.update(id, {
      concepto: input.concepto as ConceptoPago | undefined,
      estado: input.estado as EstadoPago | undefined,
      fechaPago: input.fecha_pago,
      monto: input.monto,
      moneda: input.moneda,
      metodo: input.metodo as MetodoPago | undefined,
      observacion: input.observacion,
    });

    return pago.toOutput();
  }
}
