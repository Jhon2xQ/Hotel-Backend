import { inject, injectable } from "tsyringe";
import type { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../domain/exceptions/canal.exception";
import { UpdateCanalDto, CanalDto, toCanalDto } from "../../dtos/canal.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateCanalUseCase {
  constructor(@inject(DI_TOKENS.ICanalRepository) private repository: ICanalRepository) {}

  async execute(id: string, input: UpdateCanalDto): Promise<CanalDto> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw CanalException.notFoundById();
    }

    if (input.nombre !== undefined && input.nombre !== existing.nombre) {
      const duplicate = await this.repository.findByName(input.nombre);
      if (duplicate && duplicate.id !== id) {
        throw CanalException.duplicateNombre(input.nombre);
      }
    }

    const updated = await this.repository.update(id, {
      nombre: input.nombre,
      tipo: input.tipo,
      activo: input.activo,
      notas: input.notas,
    });

    return toCanalDto(updated);
  }
}
