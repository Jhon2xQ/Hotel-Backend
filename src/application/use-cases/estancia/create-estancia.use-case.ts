import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { EstanciaException } from "../../../domain/exceptions/estancia.exception";
import { CreateEstanciaDto, EstanciaDto, toEstanciaDto } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
    @inject(DI_TOKENS.IHuespedRepository) private huespedRepository: IHuespedRepository,
  ) {}

  async execute(input: CreateEstanciaDto): Promise<EstanciaDto> {
    const reserva = await this.reservaRepository.findById(input.reservaId);
    if (!reserva) {
      throw EstanciaException.reservaNotFound();
    }

    const habitacion = await this.habitacionRepository.findById(input.habitacionId);
    if (!habitacion) {
      throw EstanciaException.habitacionNotFound();
    }

    const huesped = await this.huespedRepository.findById(input.huespedId);
    if (!huesped) {
      throw EstanciaException.huespedNotFound();
    }

    const fechaEntrada = input.fechaEntrada;
    const fechaSalida = input.fechaSalida ?? null;
    if (fechaSalida && fechaEntrada && fechaSalida <= fechaEntrada) {
      throw EstanciaException.invalidDateRange();
    }

    const estancia = await this.estanciaRepository.create({
      reservaId: input.reservaId,
      habitacionId: input.habitacionId,
      huespedId: input.huespedId,
      fechaEntrada,
      fechaSalida,
      estado: input.estado,
      notas: input.notas,
    });

    return toEstanciaDto(estancia);
  }
}
