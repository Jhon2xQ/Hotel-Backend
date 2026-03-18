import { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import { IPersonalRepository } from "../../../domain/interfaces/personal.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { UpdatePagoInput, PagoOutput } from "../../dtos/pago.dto";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../../domain/entities/pago.entity";

export class UpdatePagoUseCase {
  constructor(
    private repository: IPagoRepository,
    private personalRepository: IPersonalRepository,
  ) {}

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

    // Validate personal exists if provided
    if (input.recibido_por_id) {
      const personal = await this.personalRepository.findById(input.recibido_por_id);
      if (!personal) {
        throw PagoException.personalNotFound();
      }
    }

    const pago = await this.repository.update(id, {
      concepto: input.concepto as ConceptoPago | undefined,
      estado: input.estado as EstadoPago | undefined,
      fechaPago: input.fecha_pago,
      monto: input.monto,
      moneda: input.moneda,
      metodo: input.metodo as MetodoPago | undefined,
      recibidoPorId: input.recibido_por_id,
      notas: input.notas,
    });

    return pago.toOutput();
  }
}
