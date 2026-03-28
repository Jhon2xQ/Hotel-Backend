import { inject, injectable } from "tsyringe";
import type { IEstanciaRepository } from "../../../domain/interfaces/estancia.repository.interface";
import { EstanciaException } from "../../../domain/exceptions/estancia.exception";
import { EstanciaDto, toEstanciaDto } from "../../dtos/estancia.dto";
import { DI_TOKENS } from "../../../common/IoC/tokens";

@injectable()
export class FindEstanciaByIdUseCase {
  constructor(
    @inject(DI_TOKENS.IEstanciaRepository) private estanciaRepository: IEstanciaRepository,
  ) {}

  async execute(id: string): Promise<EstanciaDto> {
    const estancia = await this.estanciaRepository.findById(id);
    if (!estancia) {
      throw EstanciaException.notFoundById(id);
    }
    return toEstanciaDto(estancia);
  }
}
