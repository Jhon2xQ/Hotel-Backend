import { ICanalRepository } from "../../../domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../domain/exceptions/canal.exception";
import { CanalOutput } from "../../dtos/canal.dto";

export class FindCanalByIdUseCase {
  constructor(private repository: ICanalRepository) {}

  async execute(id: string): Promise<CanalOutput> {
    const canal = await this.repository.findById(id);

    if (!canal) {
      throw CanalException.notFoundById();
    }

    return canal.toOutput();
  }
}
