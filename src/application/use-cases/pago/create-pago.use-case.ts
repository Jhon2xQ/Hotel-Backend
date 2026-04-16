import { inject, injectable } from "tsyringe";
import type { IPagoRepository } from "../../../domain/interfaces/pago.repository.interface";
import type { IFolioRepository } from "../../../domain/interfaces/folio.repository.interface";
import type { IUserRepository } from "../../../domain/interfaces/user.repository.interface";
import { PagoException } from "../../../domain/exceptions/pago.exception";
import { FolioException } from "../../../domain/exceptions/folio.exception";
import { CreatePagoDto, PagoDto, toPagoDto } from "../../dtos/pago.dto";
import { ConceptoPago, EstadoPago, MetodoPago } from "../../../domain/entities/pago.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreatePagoUseCase {
  constructor(
    @inject(DI_TOKENS.IPagoRepository) private repository: IPagoRepository,
    @inject(DI_TOKENS.IFolioRepository) private folioRepository: IFolioRepository,
    @inject(DI_TOKENS.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: CreatePagoDto): Promise<PagoDto> {
    if (input.monto <= 0) {
      throw PagoException.invalidAmount();
    }

    if (input.recibido_por_id) {
      const user = await this.userRepository.findById(input.recibido_por_id);
      if (!user) {
        throw PagoException.userNotFound();
      }
    }

    if (input.folioId) {
      const folio = await this.folioRepository.findById(input.folioId);
      if (!folio) {
        throw FolioException.notFoundById(input.folioId);
      }

      if (!folio.estado) {
        throw FolioException.alreadyClosed();
      }

      const totalConsumos = await this.folioRepository.getTotal(input.folioId);
      const montoCalculado = totalConsumos;

      const pago = await this.repository.create({
        concepto: input.concepto as ConceptoPago,
        estado: input.estado as EstadoPago | undefined,
        fechaPago: input.fecha_pago,
        monto: montoCalculado,
        moneda: input.moneda,
        metodo: input.metodo as MetodoPago,
        recibidoPorId: input.recibido_por_id,
        observacion: input.observacion,
        folioId: input.folioId,
      });

      await this.folioRepository.closeWithPago(input.folioId, pago.id);

      return toPagoDto(pago);
    }

    if (input.reservaId) {
      const pago = await this.repository.create({
        concepto: input.concepto as ConceptoPago,
        estado: input.estado as EstadoPago | undefined,
        fechaPago: input.fecha_pago,
        monto: input.monto,
        moneda: input.moneda,
        metodo: input.metodo as MetodoPago,
        recibidoPorId: input.recibido_por_id,
        observacion: input.observacion,
        reservaId: input.reservaId,
      });

      return toPagoDto(pago);
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

    return toPagoDto(pago);
  }
}
