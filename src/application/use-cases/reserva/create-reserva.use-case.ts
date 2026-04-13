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

function calculateNights(fechaInicio: Date, fechaFin: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((fechaFin.getTime() - fechaInicio.getTime()) / msPerDay);
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
    if (input.fechaFin <= input.fechaInicio) {
      throw ReservaException.invalidDateRange();
    }
    if (input.adultos < 1) {
      throw ReservaException.invalidAdultos();
    }
    if (input.ninos < 0) {
      throw ReservaException.invalidNinos();
    }

    const conflicting = await this.reservaRepository.findConflictingReservations(
      input.habitacionId,
      input.fechaInicio,
      input.fechaFin,
    );
    if (conflicting.length > 0) {
      throw ReservaException.dateRangeConflict();
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

    const nights = calculateNights(input.fechaInicio, input.fechaFin);
    const precioNoche = tarifa.precio;
    const IVA = tarifa.IVA ?? 0;
    const cargoServicios = tarifa.cargoServicios ?? 0;
    const subtotalNoches = precioNoche * nights;
    const montoTotal = subtotalNoches * (1 + IVA / 100 + cargoServicios / 100);

    return await this.reservaRepository.create({
      codigo: codigo!,
      huespedId: input.huespedId,
      habitacionId: input.habitacionId,
      tarifaId: input.tarifaId,
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      adultos: input.adultos,
      ninos: input.ninos,
      nombreHuesped: `${huesped.nombres} ${huesped.apellidos}`,
      nroHabitacion: habitacion.nroHabitacion,
      nombreTipoHab: tarifa.tipoHabitacion.nombre,
      nombreCanal: tarifa.canal.nombre,
      precioNoche,
      cantidadNoches: nights,
      IVA,
      cargoServicios,
      montoTotal: Math.round(montoTotal * 100) / 100,
    });
  }
}
