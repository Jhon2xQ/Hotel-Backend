import { inject, injectable } from "tsyringe";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { ITarifaRepository } from "../../../domain/interfaces/tarifa.repository.interface";
import { ReservaException } from "../../../domain/exceptions/reserva.exception";
import { CreateReservaDto } from "../../dtos/reserva.dto";
import { generateCodigoReserva } from "../../../common/utils/codigo-generator";
import { DI_TOKENS } from "../../../common/IoC/tokens";
import type { Reserva } from "../../../domain/entities/reserva.entity";

function calculateNights(fechaEntrada: Date, fechaSalida: Date): number {
  const diff = fechaSalida.getTime() - fechaEntrada.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

@injectable()
export class CreateReservaUseCase {
  constructor(
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
    @inject(DI_TOKENS.IHuespedRepository) private huespedRepository: IHuespedRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
    @inject(DI_TOKENS.ITarifaRepository) private tarifaRepository: ITarifaRepository,
  ) {}

  async execute(input: CreateReservaDto): Promise<Reserva> {
    if (input.fechaSalida <= input.fechaEntrada) {
      throw ReservaException.invalidDateRange();
    }
    if (input.adultos < 1) {
      throw ReservaException.invalidAdultos();
    }
    if (input.ninos < 0) {
      throw ReservaException.invalidNinos();
    }

    let codigo: string | undefined;
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

    const huesped = await this.huespedRepository.findById(input.huespedId);
    if (!huesped) {
      throw ReservaException.huespedNotFound();
    }

    const habitacion = await this.habitacionRepository.findById(input.habitacionId);
    if (!habitacion) {
      throw ReservaException.habitacionNotFound();
    }

    const tarifa = await this.tarifaRepository.findById(input.tarifaId);
    if (!tarifa) {
      throw ReservaException.tarifaNotFound();
    }

    const nights = calculateNights(input.fechaEntrada, input.fechaSalida);
    const montoTotal = tarifa.precioNoche * nights;
    const montoDescuento = input.montoDescuento || 0;
    const montoFinal = montoTotal - montoDescuento;

    return await this.reservaRepository.create({
      codigo: codigo!,
      huespedId: input.huespedId,
      habitacionId: input.habitacionId,
      tarifaId: input.tarifaId,
      fechaEntrada: input.fechaEntrada,
      fechaSalida: input.fechaSalida,
      adultos: input.adultos,
      ninos: input.ninos,
      nombreHuesped: `${huesped.nombres} ${huesped.apellidos}`,
      nroHabitacion: habitacion.nroHabitacion,
      nombreTipoHab: tarifa.tipoHabitacion.nombre,
      nombreCanal: tarifa.canal.nombre,
      precioNoche: tarifa.precioNoche,
      IVA: tarifa.IVA ?? 0,
      cargoServicios: tarifa.cargoServicios ?? 0,
      montoTotal,
      montoDescuento,
      montoFinal,
    });
  }
}
