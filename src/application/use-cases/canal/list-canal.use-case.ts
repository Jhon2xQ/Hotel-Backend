import { inject, injectable } from "tsyringe";
import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalOutput } from "../../dtos/canal.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListCanalUseCase {
  constructor(@inject(DI_TOKENS.ICanalRepository) private repository: ICanalRepository) {}

  async execute(): Promise<CanalOutput[]> {
    const canales = await this.repository.findAll();
    return canales.map((canal) => canal.toOutput());
  }
}
