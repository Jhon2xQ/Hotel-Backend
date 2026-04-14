import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { EstadoReserva } from "../../../domain/entities/reserva.entity";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { toHabitacionWithMueblesDto, type HabitacionConFechasReservaAndMueblesDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindHabitacionConFechasReservaUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string, estadosReserva: EstadoReserva[]): Promise<HabitacionConFechasReservaAndMueblesDto> {
    const result = await this.repository.findByIdWithReservasAndMuebles(id, estadosReserva);

    if (!result) {
      throw HabitacionException.notFoundById();
    }

    return {
      habitacion: toHabitacionWithMueblesDto(result.habitacion, result.muebles, result.habitacion.promociones),
      fechas_reserva: result.reservas.map((r) => ({
        fecha_inicio: r.fechaInicio.toISOString(),
        fecha_fin: r.fechaFin.toISOString(),
        estado: r.estado,
      })),
    };
  }
}
