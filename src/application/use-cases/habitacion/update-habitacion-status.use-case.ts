import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionStatusDto, HabitacionDto, toHabitacionDto } from "../../dtos/habitacion.dto";
import { EstadoHabitacion } from "../../../domain/entities/habitacion.entity";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHabitacionStatusUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string, input: UpdateHabitacionStatusDto): Promise<HabitacionDto> {
    // Validate Habitacion exists (Requirement 10.1, 10.9)
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    let ultiLimpieza: Date | null | undefined = undefined;
    if (input.estado === EstadoHabitacion.LIMPIEZA) {
      ultiLimpieza = new Date();
    } else if (input.ulti_limpieza !== undefined) {
      ultiLimpieza = input.ulti_limpieza ? new Date(input.ulti_limpieza) : null;
    }

    const updated = await this.repository.updateStatus(id, {
      estado: input.estado,
      ultiLimpieza,
    });

    return toHabitacionDto(updated);
  }
}
