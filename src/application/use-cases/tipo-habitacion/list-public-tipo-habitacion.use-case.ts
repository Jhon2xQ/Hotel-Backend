import { inject, injectable } from "tsyringe";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { type PublicTipoHabitacionDto, type PublicTipoHabitacionWithHabitacionDto, toPublicTipoHabitacionDto } from "../../dtos/tipo-habitacion.dto";
import { toPublicHabitacionDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListPublicTipoHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(withHabitacion: boolean): Promise<PublicTipoHabitacionDto[] | PublicTipoHabitacionWithHabitacionDto[]> {
    if (withHabitacion) {
      const results = await this.repository.findAllWithSampleHabitacion();
      return results.map((r) => ({
        ...toPublicTipoHabitacionDto(r.tipoHabitacion),
        habitacion: r.habitacion ? toPublicHabitacionDto(r.habitacion) : null,
      }));
    }

    const tipos = await this.repository.findAll();
    return tipos.map((t) => toPublicTipoHabitacionDto(t));
  }
}
