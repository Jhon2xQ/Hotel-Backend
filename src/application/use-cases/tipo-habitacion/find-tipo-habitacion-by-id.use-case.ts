import { inject, injectable } from "tsyringe";
import type { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindTipoHabitacionByIdUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(id: string): Promise<TipoHabitacionOutput> {
    const tipoHabitacion = await this.repository.findById(id);

    if (!tipoHabitacion) {
      throw TipoHabitacionException.notFoundById();
    }

    return tipoHabitacion.toOutput();
  }
}
