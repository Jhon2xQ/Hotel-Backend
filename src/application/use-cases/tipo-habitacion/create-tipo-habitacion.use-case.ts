import { inject, injectable } from "tsyringe";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { CreateTipoHabitacionDto, TipoHabitacionDto, toTipoHabitacionDto } from "../../dtos/tipo-habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class CreateTipoHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(input: CreateTipoHabitacionDto): Promise<TipoHabitacionDto> {
    const existingTH = await this.repository.findByName(input.nombre);
    if (existingTH) {
      throw TipoHabitacionException.duplicateNombre(input.nombre);
    }

    const tipoHabitacion = await this.repository.create({
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
    });

    return toTipoHabitacionDto(tipoHabitacion);
  }
}
