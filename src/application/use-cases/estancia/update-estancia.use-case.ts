import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import type { IReservaRepository } from "../../../domain/interfaces/reserva.repository.interface";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import type { IHuespedRepository } from "../../../domain/interfaces/huesped.repository.interface";
import { EstanciaException } from "../../../domain/exceptions/estancia.exception";
import { EstadoEstadia } from "../../../domain/entities/estancia.entity";
import { EstanciaDto, UpdateEstanciaDto, toEstanciaDto } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
    @inject(DI_TOKENS.IReservaRepository) private reservaRepository: IReservaRepository,
    @inject(DI_TOKENS.IHabitacionRepository) private habitacionRepository: IHabitacionRepository,
    @inject(DI_TOKENS.IHuespedRepository) private huespedRepository: IHuespedRepository,
  ) {}

  async execute(id: string, input: UpdateEstanciaDto): Promise<EstanciaDto> {
    const existing = await this.estanciaRepository.findById(id);
    if (!existing) {
      throw EstanciaException.notFoundById(id);
    }

    if (existing.estado === EstadoEstadia.COMPLETADA) {
      throw EstanciaException.cannotModifyCompleted();
    }

    const fechaEntrada = input.fechaEntrada ?? existing.fechaEntrada;
    const fechaSalida =
      input.fechaSalida !== undefined ? input.fechaSalida : existing.fechaSalida;

    if (fechaSalida && fechaSalida <= fechaEntrada) {
      throw EstanciaException.invalidDateRange();
    }

    if (input.reservaId) {
      const reserva = await this.reservaRepository.findById(input.reservaId);
      if (!reserva) {
        throw EstanciaException.reservaNotFound();
      }
    }

    if (input.habitacionId) {
      const habitacion = await this.habitacionRepository.findById(input.habitacionId);
      if (!habitacion) {
        throw EstanciaException.habitacionNotFound();
      }
    }

    if (input.huespedId) {
      const huesped = await this.huespedRepository.findById(input.huespedId);
      if (!huesped) {
        throw EstanciaException.huespedNotFound();
      }
    }

    const estancia = await this.estanciaRepository.update(id, {
      reservaId: input.reservaId,
      habitacionId: input.habitacionId,
      huespedId: input.huespedId,
      fechaEntrada: input.fechaEntrada,
      fechaSalida: input.fechaSalida,
      estado: input.estado,
      notas: input.notas,
    });

    return toEstanciaDto(estancia);
  }
}
