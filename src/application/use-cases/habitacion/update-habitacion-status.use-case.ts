import { inject, injectable } from "tsyringe";
import type { IHabitacionRepository } from "../../../domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../domain/exceptions/habitacion.exception";
import { UpdateHabitacionStatusDto, HabitacionDto, toHabitacionDto } from "../../dtos/habitacion.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateHabitacionStatusUseCase {
  constructor(@inject(DI_TOKENS.IHabitacionRepository) private repository: IHabitacionRepository) {}

  async execute(id: string, input: UpdateHabitacionStatusDto): Promise<HabitacionDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw HabitacionException.notFoundById();
    }

    const updated = await this.repository.updateStatus(id, {
      estado: input.estado,
    });

    return toHabitacionDto(updated);
  }
}
