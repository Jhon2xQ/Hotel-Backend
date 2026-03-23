import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../domain/exceptions/canal.exception";
import { UpdateCanalInput, CanalOutput } from "../../dtos/canal.dto";

export class UpdateCanalUseCase {
  constructor(private repository: ICanalRepository) {}

  async execute(id: string, input: UpdateCanalInput): Promise<CanalOutput> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw CanalException.notFoundById();
    }

    const updated = await this.repository.update(id, {
      nombre: input.nombre,
      tipo: input.tipo,
      activo: input.activo,
      notas: input.notas,
    });

    return updated.toOutput();
  }
}
