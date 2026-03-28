import { inject, injectable } from "tsyringe";
import type { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalDto, toCanalDto } from "../../dtos/canal.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class ListCanalUseCase {
  constructor(@inject(DI_TOKENS.ICanalRepository) private repository: ICanalRepository) {}

  async execute(): Promise<CanalDto[]> {
    const canales = await this.repository.findAll();
    return canales.map((canal) => toCanalDto(canal));
  }
}
