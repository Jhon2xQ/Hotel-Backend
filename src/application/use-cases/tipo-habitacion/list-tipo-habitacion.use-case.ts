import { inject, injectable } from "tsyringe";
import { ITipoHabitacionRepository } from "../../../domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionOutput } from "../../dtos/tipo-habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListTipoHabitacionUseCase {
  constructor(
    @inject(DI_TOKENS.ITipoHabitacionRepository) private repository: ITipoHabitacionRepository,
  ) {}

  async execute(): Promise<TipoHabitacionOutput[]> {
    const tiposHabitacion = await this.repository.findAll();
    return tiposHabitacion.map((tipo) => tipo.toOutput());
  }
}
