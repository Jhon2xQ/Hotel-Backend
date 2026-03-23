import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalOutput } from "../../dtos/canal.dto";

export class ListCanalUseCase {
  constructor(private repository: ICanalRepository) {}

  async execute(): Promise<CanalOutput[]> {
    const canales = await this.repository.findAll();
    return canales.map((canal) => canal.toOutput());
  }
}
