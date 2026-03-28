import { inject, injectable } from "tsyringe";
import type { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../domain/exceptions/canal.exception";
import { CanalDto, toCanalDto } from "../../dtos/canal.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindCanalByIdUseCase {
  constructor(@inject(DI_TOKENS.ICanalRepository) private repository: ICanalRepository) {}

  async execute(id: string): Promise<CanalDto> {
    const canal = await this.repository.findById(id);

    if (!canal) {
      throw CanalException.notFoundById();
    }

    return toCanalDto(canal);
  }
}
