import { inject, injectable } from "tsyringe";
import { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { Estancia } from "../../../domain/entities/estancia.entity";
import { UpdateEstanciaInput } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class UpdateEstanciaUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string, input: UpdateEstanciaInput): Promise<Estancia> {
    return await this.estanciaRepository.update(id, input);
  }
}
