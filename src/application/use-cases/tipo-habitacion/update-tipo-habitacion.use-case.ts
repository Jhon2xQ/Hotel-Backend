import { inject, injectable } from "tsyringe";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { UpdateTipoHabitacionDto, TipoHabitacionDto, toTipoHabitacionDto } from "../../dtos/tipo-habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateTipoHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(id: string, input: UpdateTipoHabitacionDto): Promise<TipoHabitacionDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw TipoHabitacionException.notFoundById();
    }

    if (input.nombre !== undefined && input.nombre !== existing.nombre) {
      const duplicate = await this.repository.findByName(input.nombre);
      if (duplicate && duplicate.id !== id) {
        throw TipoHabitacionException.duplicateNombre(input.nombre);
      }
    }

    const updated = await this.repository.update(id, {
      nombre: input.nombre,
    });

    return toTipoHabitacionDto(updated);
  }
}
