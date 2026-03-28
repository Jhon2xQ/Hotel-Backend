import { inject, injectable } from "tsyringe";
import { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import { Reserva } from "../../../domain/entities/reserva.entity";
import { CreateReservaInput } from "../../dtos/reserva.dto";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { generateCodigoReserva } from "../../../common/utils/codigo-generator";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
  ) {}

  async execute(input: CreateReservaInput): Promise<Reserva> {
    // Validaciones de negocio
    if (input.fechaSalida <= input.fechaEntrada) {
      throw ReservaException.invalidDateRange();
    }
    if (input.adultos < 1) {
      throw ReservaException.invalidAdultos();
    }
    if (input.ninos < 0) {
      throw ReservaException.invalidNinos();
    }

    // Generar código único automáticamente
    let codigo: string;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      codigo = generateCodigoReserva();
      const existingCodigo = await this.reservaRepository.findByCodigo(codigo);

      if (!existingCodigo) {
        break;
      }

      attempts++;
    }

    if (attempts === maxAttempts) {
      throw ReservaException.codigoGenerationFailed();
    }

    return await this.reservaRepository.create({
      codigo: codigo!,
      huespedId: input.huespedId,
      habitacionId: input.habitacionId,
      tarifaId: input.tarifaId,
      fechaEntrada: input.fechaEntrada,
      fechaSalida: input.fechaSalida,
      adultos: input.adultos,
      ninos: input.ninos,
      montoDescuento: input.montoDescuento,
    });
  }
}
