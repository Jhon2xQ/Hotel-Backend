import { CanalException } from "../../../domain/exceptions/canal.exception";
import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CreateCanalInput, CanalOutput } from "../../dtos/canal.dto";

export class CreateCanalUseCase {
  constructor(private repository: ICanalRepository) {}

  async execute(input: CreateCanalInput): Promise<CanalOutput> {
    const existingCanal = await this.repository.findByName(input.nombre);
    if (existingCanal) {
      throw CanalException.duplicateNombre(input.nombre);
    }

    const canal = await this.repository.create({
      nombre: input.nombre,
      tipo: input.tipo,
      activo: input.activo ?? true,
      notas: input.notas ?? null,
    });

    return canal.toOutput();
  }
}
